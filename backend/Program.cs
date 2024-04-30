//using Scriban;

var webApplicationOptions = new WebApplicationOptions
{
    Args = args,
    WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "src", "pages", "root")
};

var builder = WebApplication.CreateBuilder(webApplicationOptions);

builder.Services.AddDatabaseDeveloperPageExceptionFilter();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(config =>
{
    config.DocumentName = "TodoAPI";
    config.Title = "TodoAPI v1";
    config.Version = "v1";
});

var app = builder.Build();

app.UseOpenApi();
app.UseSwaggerUi(config =>
{
    config.DocumentTitle = "TodoAPI";
    config.Path = "/swagger";
    config.DocumentPath = "/swagger/{documentName}/swagger.json";
    config.DocExpansion = "list";
});

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();

app.Run();

//var inputTemplateAsText = "My name is {{ name }}";
//
//var templatePath = "./wwwroot/index.html";
//
//var template = Template.Parse(File.ReadAllText(templatePath), templatePath);
//
//if (template.HasErrors)
//{
//    foreach (var error in template.Messages)
//    {
//        Console.WriteLine("Error: ", error);
//    }
//    throw new Exception("Template has errors.");
//}
//
//var result = template.Render(new { name = "Koray" });
//Console.WriteLine(result);
