// ===============================
// Eureka.Api/Program.cs (extrait DI � ajouter)
// ===============================
using Azure.Storage.Blobs;
using Eureka.Api;
using Eureka.Api.Errors;
using Eureka.Api.Infrastructure.Persistence;
using Eureka.Api.Middlewares;
using Eureka.Api.Services.Auth;
using Eureka.Api.Services.Candidates;
using Eureka.Api.Services.Security;
using Eureka.Api.Services.Storage;
using Eureka.Domain.Actualites;

using  Eureka.Api.Endpoints;

using Eureka.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;


using Microsoft.Data.SqlClient; 
using System.Data;





var builder = WebApplication.CreateBuilder(args);

builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");



/*
builder.Services
    .AddControllers()
    .AddDataAnnotationsLocalization(options =>
    {
        options.DataAnnotationLocalizerProvider = (type, factory) =>
            factory.Create(typeof(SharedValidationResource));
    })
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var traceId = context.HttpContext.TraceIdentifier;

            var errors = context.ModelState
                .Where(kvp => kvp.Value?.Errors.Count > 0)
                .ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value!.Errors
                        .Select(e => e.ErrorMessage)
                        .ToArray()
                );

            var payload = new ApiErrorResponse(
                Code: "validation_error",
                Message: "Certains champs sont invalides.",
                TraceId: traceId,
                Errors: errors
            );

            return new BadRequestObjectResult(payload);
        };
    });


builder.Services
    .AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var traceId = context.HttpContext.TraceIdentifier;

            // R�cup�re les erreurs de validation par champ
            var errors = context.ModelState
                .Where(kvp => kvp.Value?.Errors.Count > 0)
                .ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value!.Errors.Select(e =>
                        string.IsNullOrWhiteSpace(e.ErrorMessage) ? "Valeur invalide." : e.ErrorMessage
                    ).ToArray()
                );

            var payload = new ApiErrorResponse(
                Code: "validation_error",
                Message: "Certains champs sont invalides.",
                TraceId: traceId,
                Errors: errors
            );

            return new BadRequestObjectResult(payload);
        };
    });


*/


// fACTORISAITON
builder.Services
    .AddControllers()
    .AddDataAnnotationsLocalization(options =>
    {
        options.DataAnnotationLocalizerProvider = (type, factory) =>
            factory.Create(typeof(SharedValidationResource));
    })
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Where(kvp => kvp.Value?.Errors.Count > 0)
                .ToDictionary(
                    kvp => kvp.Key,
                    // On utilise ici la logique intelligente du 2ème bloc
                    kvp => kvp.Value!.Errors.Select(e =>
                        string.IsNullOrWhiteSpace(e.ErrorMessage) ? "Valeur invalide." : e.ErrorMessage
                    ).ToArray()
                );

            return new BadRequestObjectResult(new ApiErrorResponse(
                Code: "validation_error",
                Message: "Certains champs sont invalides.",
                TraceId: context.HttpContext.TraceIdentifier,
                Errors: errors
            ));
        };
    });
// FIN FACTORISAITON





// DbContext (Azure SQL) + r�silience
builder.Services.AddDbContext<EurekaDbContext>(opt =>
    opt.UseSqlServer(
        builder.Configuration.GetConnectionString("Default"),
        sql => sql.EnableRetryOnFailure(10, TimeSpan.FromSeconds(30), null)));

// Password hashing (PBKDF2)
builder.Services.AddSingleton<IPasswordHasher, Pbkdf2PasswordHasher>();

builder.Services.AddTransient<ExceptionHandlingMiddleware>();

// Azure Blob
var blobOptions = builder.Configuration.GetSection("BlobStorage").Get<BlobStorageOptions>()
                 ?? throw new InvalidOperationException("Configuration BlobStorage manquante.");

builder.Services.AddSingleton(blobOptions);
builder.Services.AddSingleton(_ => new BlobServiceClient(blobOptions.ConnectionString));
builder.Services.AddScoped<IBlobStorageService, AzureBlobStorageService>();

// Use case service
builder.Services.AddScoped<ICandidateOnboardingService, CandidateOnboardingService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Front", policy =>
        policy.WithOrigins("https://www.eureka-mayotte.fr", "http://127.0.0.1:5500",
        "https://white-beach-032430610-1.centralus.3.azurestaticapps.net/",
        "https://white-beach-032430610-1.centralus.3.azurestaticapps.net/",
        "https://polite-sky-00c4ddd03-1.westeurope.6.azurestaticapps.net/",
        "https://thankful-smoke-064996a10-1.centralus.3.azurestaticapps.net/",
        "https://lively-coast-088a84303-1.westeurope.6.azurestaticapps.net/",
        "https://blue-sand-0dff67f03-1.westeurope.1.azurestaticapps.net/",
        "https://alomaycode.github.io/alomaytri-front/")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// JWT options
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));

// Auth service
builder.Services.AddScoped<IAuthService, AuthService>();

// AuthN/AuthZ
var jwt = builder.Configuration.GetSection("Jwt").Get<JwtOptions>()
          ?? throw new InvalidOperationException("Configuration Jwt manquante.");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = true;
        options.SaveToken = true;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwt.Issuer,

            ValidateAudience = true,
            ValidAudience = jwt.Audience,

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.SigningKey)),

            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(2)
        };
    });

builder.Services.AddAuthorization();


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<EurekaDbContext>();
    await RoleSeeder.SeedAsync(db);
}

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors("Front");
var supportedCultures = new[] { new CultureInfo("fr-FR") };

app.UseRequestLocalization(new RequestLocalizationOptions
{
    DefaultRequestCulture = new("fr-FR"),
    SupportedCultures = supportedCultures,
    SupportedUICultures = supportedCultures
});






app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();





app.MapGet("/api/test", () => "hello les gens  5 ceic est un test ! ").AllowAnonymous();


app.MapGet("/api/coucou", () => "hello les gens  5 ceic est un test ! ").AllowAnonymous();
 // --  changement de doneee \

app.Run();


