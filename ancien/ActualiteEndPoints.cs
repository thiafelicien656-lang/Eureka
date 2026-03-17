using Microsoft.AspNetCore.Mvc;
using Eureka.Domain.Actualites;
using Eureka.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Eureka.Api.Controllers;



[ApiController]
[Route("api/[controller]")]
public class ActualitesController : ControllerBase
      {

            private readonly EurekaDbContext _db;


            public ActualitesController(EurekaDbContext db)
            {
                _db = db;
            }

        [HttpGet("last-actu-all")]
            public async Task<IActionResult> GetLastTitlesByCategory()
            {
                var result = await _db.Set<Actualite>()
                    .GroupBy(a => a.Categorie)
                    .Select(g => new 
                    {
                        Categorie = g.Key,
                        DernierTitre = g.OrderByDescending(a => a.Id).Select(a => a.Titre).FirstOrDefault()
                    })
                    .ToListAsync();

                return Ok(result);
            }


            [HttpGet("last")]
                public async Task<IActionResult> GetLastActualite([FromQuery] string cat)
                {
                    var lastActu = await _db.Set<Actualite>()
                        .Where(a => a.Categorie == cat)
                        .OrderByDescending(a => a.Id)
                        // Note: Assure-toi que ActualiteReadDto est accessible ici
                        .Select(a => new ActualiteReadDto(a.Id, a.Titre, a.Categorie, a.DescriptionCourte, a.Contenu))
                        .FirstOrDefaultAsync();

                    return lastActu is not null ? Ok(lastActu) : NotFound();
                }


            [HttpGet("image/{id}")]
                public async Task<IActionResult> GetImage(int id)
                {
                    var image = await _db.Set<ActualiteImage>()
                        .Where(img => img.ActualiteId == id)
                        .Select(img => new { img.ImageData, img.ContentType })
                        .FirstOrDefaultAsync();

                    if (image == null) return NotFound();
                    
                    return File(image.ImageData, image.ContentType ?? "image/jpeg");
                }


       [HttpPost]
        [Consumes("multipart/form-data")] // Indique qu'on attend un formulaire avec fichier
        public async Task<IActionResult> CreateActualite([FromForm] ActualiteCreateRequest request, IFormFile? Photo)
        {
            // On utilise un DTO ou les paramètres directement pour plus de clarté
            var actualite = new Actualite 
            {
                Titre = request.Titre,
                Categorie = request.Categorie,
                DescriptionCourte = request.Description,
                Contenu = request.Contenu
            };

            using var transaction = await _db.Database.BeginTransactionAsync();

            try
            {
                _db.Set<Actualite>().Add(actualite);
                await _db.SaveChangesAsync();

                if (Photo != null && Photo.Length > 0)
                {
                    using var ms = new MemoryStream();
                    await Photo.CopyToAsync(ms);

                    var actualiteImage = new ActualiteImage 
                    {
                        ActualiteId = actualite.Id,
                        ImageData = ms.ToArray(),
                        ContentType = Photo.ContentType
                    };

                    _db.Set<ActualiteImage>().Add(actualiteImage);
                    await _db.SaveChangesAsync();
                }

                await transaction.CommitAsync();
                return Ok(new { Message = "Succès", Id = actualite.Id });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return Problem("Erreur lors de l'insertion : " + ex.Message);
            }
        }
}

public record ActualiteCreateRequest(string Titre, string Categorie, string Description, string Contenu);