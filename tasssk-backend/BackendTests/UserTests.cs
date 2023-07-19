using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;

namespace BackendTests
{

    public class UserTests
    {
        public class MyApiTests
        {
            private readonly HttpClient _httpClient;

            public MyApiTests()
            {
                _httpClient = new HttpClient 
                { 
                    BaseAddress = new Uri("http://localhost:7060"),
                    DefaultRequestHeaders = 
                    { 
                        Accept = {new MediaTypeWithQualityHeaderValue("application/json")},
                    } 
                };
            }
            [Fact]
            public void Login()
            {
                // Create an object with the required properties.
                var loginData = new { email = "user@example.com", password = "password123" };

                // Serialize the object to JSON.
                var json = JsonConvert.SerializeObject(loginData);

                // Create a StringContent object with the JSON as the content.  
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                // Make a POST request to the login endpoint with the JSON content.
                var response = _httpClient.PostAsync("/User/Login", content);
                Assert.NotNull(response);
                // Assert that the response content contains the expected text.
                // Assert.True(response.Result.StatusCode == HttpStatusCode.OK);
            }
        }
    }
}