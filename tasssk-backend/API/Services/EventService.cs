using MongoDB.Driver;
using TassskAPI.Models;
using TassskAPI.Services;
using TassskAPI.DTOs.Event;

namespace TassskAPI.Services
{
    public class EventService : BaseService
    {
        public async Task<List<EventDTO>> GetEvents(string email)
        { 
            var user = await db.GetCollection<User>(UserCollection).Find(x => x.Email == email).FirstOrDefaultAsync();

            var lists=  await db.GetCollection<List>(ListCollection)
                 .Find(Builders<List>.Filter
                 .ElemMatch(x => x.Privileges, z => z.Email == user.Email))
                 .ToListAsync();

            var result = lists.Select(x =>
            new EventDTO
            {                
                ListId = x.Id.ToString(),
                Date = x.FinishDate,
                Name = x.Name
            }).ToList();

            return result;
        }
    }
}
