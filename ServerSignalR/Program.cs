using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using ServerSignalR;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
builder.Services.AddCors();

var app = builder.Build();

app.UseCors(builder =>
builder
 .AllowAnyMethod()
 .AllowAnyHeader()
 .SetIsOriginAllowed(origin => true)
 .AllowCredentials()
);

app.MapHub<NotificationsHub>("notifications");

app.Run();