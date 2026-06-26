using System;
using System.IO;
using System.Threading.Tasks;
using Amazon.S3;
using Amazon.S3.Transfer;
using Microsoft.Extensions.Configuration;
using OttPlatform.Core.Interfaces;

namespace OttPlatform.Infrastructure.Services
{
    public class AwsS3Service : IAwsS3Service
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public AwsS3Service(IConfiguration configuration)
        {
            var options = configuration.GetSection("AWS");
            _s3Client = new AmazonS3Client(options["AccessKey"], options["SecretKey"], Amazon.RegionEndpoint.GetBySystemName(options["Region"]));
            _bucketName = options["BucketName"] ?? string.Empty;
        }

        public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType, string folder = "videos")
        {
            var fileTransferUtility = new TransferUtility(_s3Client);
            var key = $"{folder}/{Guid.NewGuid()}_{fileName}";

            await fileTransferUtility.UploadAsync(new TransferUtilityUploadRequest
            {
                InputStream = fileStream,
                Key = key,
                BucketName = _bucketName,
                ContentType = contentType,
                CannedACL = S3CannedACL.PublicRead
            });

            return $"https://{_bucketName}.s3.amazonaws.com/{key}";
        }

        public async Task DeleteFileAsync(string fileUrl)
        {
            var uri = new Uri(fileUrl);
            var key = uri.AbsolutePath.TrimStart('/');

            await _s3Client.DeleteObjectAsync(_bucketName, key);
        }
    }
}
