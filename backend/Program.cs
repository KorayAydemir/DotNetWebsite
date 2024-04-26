using Microsoft.EntityFrameworkCore;
//using Scriban;

var webApplicationOptions = new WebApplicationOptions
{
    Args = args,
    WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "src")
};

var builder = WebApplication.CreateBuilder(webApplicationOptions);

builder.Services.AddDbContext<TodoDb>(opt => opt.UseInMemoryDatabase("TodoList"));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(config =>
{
    config.DocumentName = "TodoAPI";
    config.Title = "TodoAPI v1";
    config.Version = "v1";
});


var app = builder.Build();

//if (app.Environment.IsDevelopment())
//{
app.UseOpenApi();
app.UseSwaggerUi(config =>
{
    config.DocumentTitle = "TodoAPI";
    config.Path = "/swagger";
    config.DocumentPath = "/swagger/{documentName}/swagger.json";
    config.DocExpansion = "list";
});
//}

app.UseHttpsRedirection();
app.UseRouting();
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/todoitems", async (TodoDb db) =>
{
    return await db.Todos.ToListAsync();
});

app.MapGet("/todoitems/complete", async (TodoDb db) =>
    await db.Todos.Where(t => t.IsComplete).ToListAsync());

app.MapGet("/todoitems/{id}", async (int id, TodoDb db) =>
    await db.Todos.FindAsync(id)
        is Todo todo
            ? Results.Ok(todo)
            : Results.NotFound());

app.MapPost("/todoitems", async (Todo todo, TodoDb db) =>
{
    db.Todos.Add(todo);
    await db.SaveChangesAsync();

    return Results.Created($"/todoitems/{todo.Id}", todo);
});

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
