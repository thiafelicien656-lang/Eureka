using Eureka.Domain.Actualites;
using Eureka.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Eureka.Api.Endpoints;

public static class ActualiteEndpoints
      {
      public static void MapActualiteEndpoints(this IEndpointRouteBuilder app)
      {
            var group = app.MapGroup("/api/actualites");

            group.MapGet("/last-titles-by-category", async (EurekaDbContext db) =>
{
    // On regroupe par catégorie, puis on prend le Titre de la plus récente
    var result = await db.Set<Actualite>()
        .GroupBy(a => a.Categorie)
        .Select(g => new 
        {
            Categorie = g.Key,
            DernierTitre = g.OrderByDescending(a => a.Id).Select(a => a.Titre).FirstOrDefault()
        })
        .ToListAsync();

    return Results.Ok(result);
}).AllowAnonymous();

            group.MapGet("/last", async (string cat, EurekaDbContext db) =>
            {
                  var lastActu = await db.Set<Actualite>()
                  .Where(a => a.Categorie == cat)
                  .OrderByDescending(a => a.Id)
                  .Select(a => new ActualiteReadDto(a.Id, a.Titre, a.Categorie, a.DescriptionCourte, a.Contenu))
                  .FirstOrDefaultAsync();

                  return lastActu is not null ? Results.Ok(lastActu) : Results.NotFound();
            }).AllowAnonymous();

        group.MapGet("/image/{id}", async (int id, EurekaDbContext db) =>
        {
            var image = await db.Set<ActualiteImage>()
                .Where(img => img.ActualiteId == id)
                .Select(img => new { img.ImageData, img.ContentType })
                .FirstOrDefaultAsync();

            return image is not null ? Results.File(image.ImageData, image.ContentType ?? "image/jpeg") : Results.NotFound();
        }).AllowAnonymous();

        group.MapPost("/", async (HttpContext context, EurekaDbContext db) =>
        {
            var form = await context.Request.ReadFormAsync();
    
    // test
    var actualite = new Actualite 
    {
        Titre = form["titre"],
        Categorie = form["categorie"],
        DescriptionCourte = form["description"],
        Contenu = form["contenu"]
    };

    using var transaction = await db.Database.BeginTransactionAsync();

    try
    {
        db.Set<Actualite>().Add(actualite);
        await db.SaveChangesAsync();

        var file = form.Files["Photo"];
        if (file != null && file.Length > 0)
        {
            using var ms = new MemoryStream();
            await file.CopyToAsync(ms);

            var actualiteImage = new ActualiteImage 
            {
                ActualiteId = actualite.Id,
                ImageData = ms.ToArray(),
                ContentType = file.ContentType
            };

            db.Set<ActualiteImage>().Add(actualiteImage);
            await db.SaveChangesAsync();
        }

        await transaction.CommitAsync();
        return Results.Ok(new { Message = "Succès", Id = actualite.Id });
    }
    catch (Exception ex)
    {
        await transaction.RollbackAsync();
        return Results.Problem("Erreur lors de l'insertion : " + ex.Message);
    }
        }).AllowAnonymous();
    }



    
}