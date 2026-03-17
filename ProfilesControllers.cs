using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Eureka.Persistence;
using Microsoft.EntityFrameworkCore;
using Eureka.Domain.Candidates;
using Eureka.Domain.Users;

namespace Eureka.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableCors("Front")]


public class ProfilesController : ControllerBase
{
    private readonly EurekaDbContext _db;

    public ProfilesController(EurekaDbContext db)
    {
        _db = db;
    }

    [HttpGet("profile/{userId:guid}")]
    public async Task<IActionResult> GetProfile(Guid userId)
    {
        var profile = await _db.CandidateProfiles
            .Where(p => p.UserId == userId)
            .Join(_db.Users,
                p => p.UserId,
                u => u.Id,
                (p, u) => new CandidateProfileReadDto(
                    $"{p.FirstName} {p.LastName}",
                    u.Email,
                    p.Phone,
                    "Développeur Web Junior", // Valeur à dynamiser si tu as un champ Titre
                    p.Summary,                // Mappé sur la Bio
                    new List<string> { "HTML5/CSS3", "JavaScript", "React", "Tailwind CSS", "Git" }, 
                    p.Commune
                ))
            .FirstOrDefaultAsync();

        if (profile == null) 
        {
            return NotFound(new { Message = "Aucun profil trouvé pour cet identifiant." });
        }

        return Ok(profile);
    }
}

// DTO pour la réponse JSON
public record CandidateProfileReadDto(
    string Name,
    string Email,
    string Phone,
    string Title,
    string Bio,
    List<string> Skills,
    string Location
);