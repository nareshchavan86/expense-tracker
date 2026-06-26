using System.IO;
using System.Threading.Tasks;

namespace OttPlatform.Core.Interfaces
{
    public interface IAwsS3Service
    {
        Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType, string folder = "videos");
        Task DeleteFileAsync(string fileUrl);
    }
}
