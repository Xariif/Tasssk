using Bogus;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using TassskAPI.DTOs;
using TassskAPI.DTOs.User;
using TassskAPI.Interfaces;
using TassskAPI.Models;
using TassskAPI.Services;

namespace BackendTests
{

    public class UserTests

    {
        private readonly UserService _userService;
        private readonly ITokenService _tokenService;
        private readonly Bogus.Randomizer random = new Bogus.Randomizer();

        private readonly Faker<RegisterDTO> _faker;


        public UserTests()
        {

            var configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build();
            // Create an instance of the actual TokenService
            _tokenService = new TokenService(configuration);

            // Inject the actual TokenService into the UserService constructor
            _userService = new UserService(_tokenService);
        }




        public static IEnumerable<object[]> TestData()
        {
            yield return new object[] { GenerateRandomRegisterDTO()};
        }
        public static RegisterDTO GenerateRandomRegisterDTO()
        {

            var rnd = new Bogus.Randomizer();
         
            var faker = new Faker<RegisterDTO>()
                .RuleFor(u => u.Email, (f, u) => f.Internet.Email())
                .RuleFor(u => u.Password, (f, u) => f.Internet.Password(rnd.Int(0,30),false))
                .RuleFor(u => u.BirthDate, (f, u) => f.Date.Past(18));

            return faker.Generate();
        }


        [Theory]
        [MemberData(nameof(TestData))]
        public async Task Register_IsEssa( RegisterDTO registerDTO )
        {


            Assert.True(true);


        }


        [Theory]
        [InlineData("MAciekTestowy@test.pl", "StrongPAss123", "2015-05-15", typeof(ArgumentException))]// Invalid birthdate
        [InlineData("test@test.pl", "StrongPAss123", "2013-01-01", typeof(ArgumentException))]// Invalid email - occupied
        [InlineData("PassTest@test.pl", "", "2013-01-01", typeof(ArgumentException))]// Invalid password - too short
        [InlineData("testuser2@test.com", "P@ssw000rd123", "1995-05-15", null)] // Valid birthdate
        public async Task Register_ShouldComplete(string email, string password, DateTime birthdate, Type expectedExceptionType)
        {
            // Arrange
            var registerDTO = new RegisterDTO
            {
                Email = email,
                Password = password,
                BirthDate = birthdate.ToUniversalTime()
            };

            // Act
            if (expectedExceptionType != null)
            {
                await Assert.ThrowsAsync(expectedExceptionType, () => _userService.RegisterAsync(registerDTO));

            }
            else
            {
                await _userService.RegisterAsync(registerDTO);

                // Assert
                var user = await _userService.GetUserByEmailAsync(registerDTO.Email);
                Assert.NotNull(user);
                Assert.Equal(registerDTO.Email, user.Email);
                Assert.Equal(registerDTO.BirthDate, user.BirthDate);
            }

            // Clean up
            await _userService.DeleteAccountAsync(registerDTO.Email);
        }

        [Fact]
        public async Task Login_ShouldBeSuccessfull()
        {
            // Arrange

            var registerDTO = new RegisterDTO
            {
                Email = ObjectId.GenerateNewId() + "@test.pl",
                Password = "Qwerty123",
                BirthDate = DateTime.Now.AddYears(-20)
            };

            var loginDTO = new LoginDTO
            {
                Email = registerDTO.Email,
                Password = registerDTO.Password
            };

            //Act
            await _userService.RegisterAsync(registerDTO);

            var user = await _userService.LoginAsync(loginDTO);

            await _userService.DeleteAccountAsync(registerDTO.Email);

            //Assert
            Assert.NotNull(user);

        }

        [Fact]
        public async Task DeleteAccount_ShouldReturnTrue()
        {
            // Arrange

            var registerDTO = new RegisterDTO
            {
                Email = ObjectId.GenerateNewId() + "@test.pl",
                Password = "Qwerty123",
                BirthDate = new DateTime(1999, 12, 12)
            };
            await _userService.RegisterAsync(registerDTO);

            // Act
            var result = await _userService.DeleteAccountAsync(registerDTO.Email);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task ValidateToken_ShouldReturnTrue()
        {
            // Arrange

            var registerDTO = new RegisterDTO
            {
                Email = ObjectId.GenerateNewId() + "@test.pl",
                Password = "Qwerty123",
                BirthDate = new DateTime(1999, 12, 12)
            };

            var loginDTO = new LoginDTO
            {
                Email = registerDTO.Email,
                Password = registerDTO.Password
            };

            // Act

            await _userService.RegisterAsync(registerDTO);

            var user = await _userService.LoginAsync(loginDTO);

            var result = _userService.ValidateToken(user.Token);

            await _userService.DeleteAccountAsync(registerDTO.Email);

            // Assert

            Assert.True(result);
            Assert.NotNull(user);
        }
    }
}