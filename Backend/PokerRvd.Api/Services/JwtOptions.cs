using Microsoft.IdentityModel.Tokens;

namespace PokerRvd.Api.Services;

public record JwtOptions(SymmetricSecurityKey ChaveAssinatura, int ExpiraHoras);
