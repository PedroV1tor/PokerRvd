using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace PokerRvd.Api.Services;

public interface IImagemService
{
    bool Configurado { get; }
    Task<string> EnviarAsync(IFormFile arquivo, CancellationToken cancellationToken = default);
}

/// <summary>
/// Envia imagens para o Cloudinary. O disco do container no Railway é apagado a cada deploy.
/// Configuração: Cloudinary__CloudName, Cloudinary__ApiKey e Cloudinary__ApiSecret.
/// </summary>
public class ImagemService : IImagemService
{
    private const string Pasta = "rvd-landing";

    private readonly HttpClient _http;
    private readonly string? _cloudName;
    private readonly string? _apiKey;
    private readonly string? _apiSecret;

    public ImagemService(HttpClient http, IConfiguration configuration)
    {
        _http = http;
        _cloudName = configuration["Cloudinary:CloudName"];
        _apiKey = configuration["Cloudinary:ApiKey"];
        _apiSecret = configuration["Cloudinary:ApiSecret"];
    }

    public bool Configurado =>
        !string.IsNullOrWhiteSpace(_cloudName) &&
        !string.IsNullOrWhiteSpace(_apiKey) &&
        !string.IsNullOrWhiteSpace(_apiSecret);

    public async Task<string> EnviarAsync(IFormFile arquivo, CancellationToken cancellationToken = default)
    {
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();

        using var form = new MultipartFormDataContent();
        await using var stream = arquivo.OpenReadStream();
        form.Add(new StreamContent(stream), "file", "imagem");
        form.Add(new StringContent(_apiKey!), "api_key");
        form.Add(new StringContent(timestamp), "timestamp");
        form.Add(new StringContent(Pasta), "folder");
        form.Add(new StringContent(Assinar($"folder={Pasta}&timestamp={timestamp}")), "signature");

        using var resposta = await _http.PostAsync(
            $"https://api.cloudinary.com/v1_1/{_cloudName}/image/upload", form, cancellationToken);

        var corpo = await resposta.Content.ReadAsStringAsync(cancellationToken);
        if (!resposta.IsSuccessStatusCode)
            throw new InvalidOperationException($"Cloudinary respondeu {(int)resposta.StatusCode}: {corpo}");

        using var json = JsonDocument.Parse(corpo);
        var url = json.RootElement.GetProperty("secure_url").GetString()!;

        // Entrega em formato e tamanho adequados, mesmo com foto pesada de celular
        return url.Replace("/image/upload/", "/image/upload/f_auto,q_auto,c_limit,w_1200/");
    }

    private string Assinar(string parametros)
    {
        var hash = SHA1.HashData(Encoding.UTF8.GetBytes(parametros + _apiSecret));
        return Convert.ToHexString(hash).ToLowerInvariant();
    }
}
