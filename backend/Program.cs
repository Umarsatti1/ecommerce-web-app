using System.Text;
using Amazon.S3;
using backend.Data;
using backend.Entities;
using backend.Middleware;
using backend.RequestHelpers;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json.Linq; // To parse JSON

var builder = WebApplication.CreateBuilder(args);

// Updated: Fetch secrets from AWS Secrets Manager with fallback for local credentials
var dbSecret = await SecretsHelper.GetSecretStringAsync("/ecommerceapp/database-connection", "us-east-1");

// Parse the secret string to extract the connection string
var dbSecretJson = JObject.Parse(dbSecret);
var dbConnectionString = dbSecretJson["DefaultConnection"]?.ToString(); // Extract the connection string

// Updated: Log connection string for debugging (optional, remove in production)
Console.WriteLine($"Database Connection String: {dbConnectionString}");

// Updated: Fetch Stripe and AWS secrets
var stripeSecrets = await SecretsHelper.GetSecretAsync("/ecommerceapp/stripe", "us-east-1");
var awsSecrets = await SecretsHelper.GetSecretAsync("/ecommerceapp/aws", "us-east-1");

// Updated: Add secrets to the app configuration
builder.Configuration["ConnectionStrings:DefaultConnection"] = dbConnectionString;
builder.Configuration["StripeSettings:PublishableKey"] = stripeSecrets["PublishableKey"];
builder.Configuration["StripeSettings:SecretKey"] = stripeSecrets["SecretKey"];
builder.Configuration["StripeSettings:WhSecret"] = stripeSecrets["WhSecret"];
builder.Configuration["AWS:BucketName"] = awsSecrets["BucketName"];
builder.Configuration["AWS:AccessKey"] = awsSecrets["AccessKey"];
builder.Configuration["AWS:SecretKey"] = awsSecrets["SecretKey"];
builder.Configuration["AWS:Region"] = awsSecrets["Region"];

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // Configuring Swagger with JWT Bearer token support
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "Put Bearer + Your token in the box below",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            jwtSecurityScheme, Array.Empty<string>()
        }
    });
});

// Configure DbContext with the correct connection string
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 39))
    )
);

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder.WithOrigins("http://localhost", "http://localhost:80", "http://frontend") // Frontend container and host
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

// Configure Identity and Authentication
builder.Services.AddIdentityCore<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;
})
    .AddRoles<Role>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(builder.Configuration["JWTSettings:TokenKey"]))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<PaymentService>();
builder.Services.AddAWSService<IAmazonS3>();
builder.Services.AddScoped<ImageService>();
builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());

// Build the application
var app = builder.Build();

// Middleware pipeline
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.ConfigObject.AdditionalItems.Add("persistAuthorization", "true");
    });
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("CorsPolicy");

// app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToController("Index", "Fallback");

// Apply database migrations and seed data
var scope = app.Services.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
try
{
    await context.Database.MigrateAsync();
    await DbInitializer.Initialize(context, userManager);
}
catch (Exception ex)
{
    logger.LogError(ex, "A problem occurred during migration");
}

// Run the application
app.Run();
