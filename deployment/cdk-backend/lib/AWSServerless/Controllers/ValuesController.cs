using Microsoft.AspNetCore.Mvc;
using Tesseract;

namespace AWSServerless.Controllers;

[Route("api/[controller]")]
public class ValuesController : ControllerBase
{
    private readonly IWebHostEnvironment _hostingEnvironment;

    public ValuesController(IWebHostEnvironment hostingEnvironment)
    {
        _hostingEnvironment = hostingEnvironment;
    }

    // GET api/values
    [HttpGet]
    public IActionResult Get()
    {
        // Get the path to the wwwroot folder
        var wwwrootPath = _hostingEnvironment.WebRootPath;

        // Construct the path to your image file within wwwroot
        var imagePath = Path.Combine(wwwrootPath, "slip-example.jpeg");

        // Check if the file exists
        if (!System.IO.File.Exists(imagePath))
        {
            return NotFound("Image not found");
        }

        // Read the image file
        var imageBytes = System.IO.File.ReadAllBytes(imagePath);

        // Your C# OCR logic using Tesseract here
        using (var engine = new TesseractEngine(@"./tessdata", "eng", EngineMode.Default))
        using (var image = Pix.LoadFromMemory(imageBytes))
        {
            using (var page = engine.Process(image))
            {
                var result = page.GetText();

                return Ok(result);
            }
        }

        //return new string[] { "value1", "value2" };
    }

    // GET api/values/5
    [HttpGet("{id}")]
    public string Get(int id)
    {
        return "value";
    }

    // POST api/values
    [HttpPost]
    public void Post([FromBody] string value)
    {
    }

    // PUT api/values/5
    [HttpPut("{id}")]
    public void Put(int id, [FromBody] string value)
    {
    }

    // DELETE api/values/5
    [HttpDelete("{id}")]
    public void Delete(int id)
    {
    }
}