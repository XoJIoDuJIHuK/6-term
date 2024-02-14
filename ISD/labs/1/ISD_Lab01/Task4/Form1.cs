using System.Net;
using System.Security.Policy;
using System.Text;

namespace Task4
{
    public partial class Form1 : Form
    {
        private const string Url = "http://localhost:5000/4.TOV";

        private readonly HttpClient httpClient;

        public Form1()
        {
            InitializeComponent();
            httpClient = new HttpClient();
        }

        private async void button1_Click(object sender, EventArgs e)
        {
            string param1 = textBox1.Text;
            string param2 = textBox2.Text;

            string postData = $"{{\"ParmA\":\"{param1}\",\"ParmB\":\"{param2}\"}}";

            try
            {
                var content = new StringContent(postData, Encoding.UTF8, "application/json");

                HttpResponseMessage response = await httpClient.PostAsync(Url, content);
                response.EnsureSuccessStatusCode();

                string responseBody = await response.Content.ReadAsStringAsync();

                textBox3.Text = responseBody;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Произошла ошибка при отправке запроса: {ex.Message}", "Ошибка", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}