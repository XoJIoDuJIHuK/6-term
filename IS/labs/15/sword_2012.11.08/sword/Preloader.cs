using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace sword
{
    public partial class Preloader : Form
    {
        public Preloader()
        {
            InitializeComponent();
            this.TransparencyKey = Color.Gainsboro;
            

        }

        private void Form1_Load(object sender, EventArgs e)
        {
            // Выводим форму в центре экрана 
            this.Location = new Point((Screen.PrimaryScreen.Bounds.Width - this.Width) / 2, (Screen.PrimaryScreen.Bounds.Height - this.Height) / 2); 





        }

        private void Form1_Paint(object sender, PaintEventArgs e)
        {
            e.Graphics.Clear(Color.Gainsboro); 
           /*
            int stepTopX = 120;
            int xA = this.ClientRectangle.Width / 2 - stepTopX;
            int xB = this.ClientRectangle.Width / 2 + stepTopX;
           
e.Graphics.FillPolygon(Brushes.Gray, new PointF[] { 
new Point(xA, 0), 
new Point(xB, 0), 
new Point(this.ClientRectangle.Width, this.ClientRectangle.Height /2-50), 
new Point(this.ClientRectangle.Width /2, this.ClientRectangle.Height), 
new Point(0, this.ClientRectangle.Height /2-50), 
new Point(xA, 0)
}); 
Font f = new Font(this.Font.Name, 20); 
e.Graphics.DrawString("Steganografia Word", 
f, Brushes.Black, 20, 
(this.ClientRectangle.Height / 2) - (f.Height / 2)); 
*/
        }

        private void pictureBox2_Click(object sender, EventArgs e)
        {

        }

        private void pictureBox1_Click(object sender, EventArgs e)
        {

        }

        private void bImplant_Click(object sender, EventArgs e)
        {
            //MessageBox.Show("implant");
        }
    }
}
