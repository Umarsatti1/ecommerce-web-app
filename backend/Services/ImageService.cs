using Amazon;
using Amazon.S3;
using Amazon.S3.Model;

namespace backend.Services
{
    public class ImageService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public ImageService(IConfiguration config)
        {
            var awsOptions = config.GetAWSOptions();
            _s3Client = awsOptions.CreateServiceClient<IAmazonS3>();

            _bucketName = config["AWS:BucketName"];
            if (string.IsNullOrEmpty(_bucketName))
            {
                throw new InvalidOperationException("S3 BucketName is not configured in appsettings.json.");
            }
        }

        public async Task<string> AddImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File is invalid or empty.", nameof(file));
            }

            var key = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            using var stream = file.OpenReadStream();

            var putRequest = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = key,
                InputStream = stream,
                ContentType = file.ContentType,
            };

            try
            {
                Console.WriteLine($"Attempting to upload file with key: {key} to bucket: {_bucketName}");

                var response = await _s3Client.PutObjectAsync(putRequest);
                Console.WriteLine($"File uploaded successfully. S3 response: {response.HttpStatusCode}");

                return $"https://{_bucketName}.s3.{RegionEndpoint.USEast1.SystemName}.amazonaws.com/{key}";
            }
            catch (AmazonS3Exception ex)
            {
                Console.WriteLine($"AWS S3 Error: {ex.Message}, Request ID: {ex.RequestId}, HTTP Code: {ex.StatusCode}");
                throw new InvalidOperationException($"AWS error: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"General Error: {ex.Message}");
                throw new InvalidOperationException($"General error: {ex.Message}", ex);
            }
        }


        public async Task DeleteImageAsync(string key)
        {
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentException("File key must be provided for deletion.", nameof(key));
            }

            var deleteRequest = new DeleteObjectRequest
            {
                BucketName = _bucketName,
                Key = key
            };

            try
            {
                await _s3Client.DeleteObjectAsync(deleteRequest);
            }
            catch (AmazonS3Exception ex)
            {
                // Handle AWS-specific exceptions
                throw new InvalidOperationException($"Error deleting file from S3: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                // Handle general exceptions
                throw new InvalidOperationException($"An unexpected error occurred while deleting the file: {ex.Message}", ex);
            }
        }
    }
}
