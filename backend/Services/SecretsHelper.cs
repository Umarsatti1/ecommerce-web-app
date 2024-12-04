using Amazon;
using Amazon.Runtime;
using Amazon.SecretsManager;
using Amazon.SecretsManager.Model;
using Newtonsoft.Json.Linq;

public static class SecretsHelper
{
    // Method to get secret as a dictionary
    public static async Task<IDictionary<string, string>> GetSecretAsync(string secretName, string region = "us-east-1")
    {
        // Updated to use FallbackCredentialsFactory to support local credentials and IMDS
        var client = new AmazonSecretsManagerClient(FallbackCredentialsFactory.GetCredentials(), RegionEndpoint.GetBySystemName(region));

        var request = new GetSecretValueRequest
        {
            SecretId = secretName,
            VersionStage = "AWSCURRENT", // Always fetch the latest version
        };

        try
        {
            var response = await client.GetSecretValueAsync(request);

            if (response.SecretString != null)
            {
                // Parse the secret string as JSON and return as a dictionary
                return JObject.Parse(response.SecretString).ToObject<Dictionary<string, string>>();
            }

            throw new Exception("Secret value is null");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching secret {secretName}: {ex.Message}");
            throw;
        }
    }

    // Method to get secret as a raw string
    public static async Task<string> GetSecretStringAsync(string secretName, string region = "us-east-1")
    {
        // Updated to use FallbackCredentialsFactory to support local credentials and IMDS
        var client = new AmazonSecretsManagerClient(FallbackCredentialsFactory.GetCredentials(), RegionEndpoint.GetBySystemName(region));

        var request = new GetSecretValueRequest
        {
            SecretId = secretName,
            VersionStage = "AWSCURRENT",
        };

        try
        {
            var response = await client.GetSecretValueAsync(request);
            return response.SecretString ?? throw new Exception("Secret string is null");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching secret {secretName}: {ex.Message}");
            throw;
        }
    }
}
