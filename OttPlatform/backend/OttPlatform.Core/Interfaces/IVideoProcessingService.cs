using System.Threading.Tasks;

namespace OttPlatform.Core.Interfaces
{
    public interface IVideoProcessingService
    {
        Task<string> ProcessToHlsAsync(string inputFilePath, string outputFolder);
    }
}
