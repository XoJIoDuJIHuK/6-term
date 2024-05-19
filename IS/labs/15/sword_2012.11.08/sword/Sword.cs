using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using System.Text.RegularExpressions;
using Word = Microsoft.Office.Interop.Word;

using System.Threading;

namespace sword
{
    public partial class Sword : Form
    {
        Word.Application officeWord;//программа Office Word
        Word.Document doc;//документ
        String pathDoc;
        String originalSecretText;
        List<int> indexs;
        delegate void SetTextCallback(bool flag);
        private Thread demoThread = null;

        public Sword()
        {

            InitializeComponent();
        }

        private void Sword_Load(object sender, EventArgs e)
        {

            // Выводим форму в центре экрана 
            this.Location = new Point((Screen.PrimaryScreen.Bounds.Width - this.Width) / 2, (Screen.PrimaryScreen.Bounds.Height - this.Height) / 2);
            changeViewWordFace(false);

            tfKeyArxiv.Visible = false;
            labelKeyArxiv.Visible = false;

            bImplant.Visible = false;
            bExtract.Visible = false;
            bViewImplant.Visible = false;

            //          tfAnyEncoder.Text = "32";
            //originalSecretText = "a↓₪ф";
         //   originalSecretText = "fф↓";
            //   originalSecretText = "ф";
            //   r8.Checked = true;
            tfSecretText.Text = originalSecretText;

            tfR0.Text = "0";
            tfG0.Text = "0";
            tfB0.Text = "1";

            tfR1.Text = "0";
            tfG1.Text = "1";
            tfB1.Text = "0";

            labelStatusExtract.Text = "";


            //Form1 form1 = new Form1();
            //form1.Show();

            //form1.Parent = this.Parent;
        }

        private String binToString(String strBin, Encoding encoding, int size)
        {
            byte[] arr = new byte[strBin.Length / size];
            for (int i = 0; i < strBin.Length; i += size)
            {
                string ss = strBin.Substring(i, size);
                byte bv = Convert.ToByte(ss, 2);
                arr[i / size] = bv;
            }
            string res = encoding.GetString(arr);

            return res;
        }

        private void Sword_Shown(object sender, EventArgs e)
        {
            this.Visible = false;

            Preloader preloader = new Preloader();
            preloader.Show();

            initOfficeWord();
            //officeWord.Visible = true;
            preloader.Close();

            this.Visible = true;
            this.Activate();

            //  loadWord(@"D:\job\bgtu\stego\source\present2.docx");


            //ColorConverter conv = new ColorConverter();
            //conv.
        }
       
        private void setEncoding()
        {
            if (rCurrentEncoding.Checked)
            {
                rCurrentEncoding_Click(this, null);
            }
            if (rBinText.Checked)
            {
                rBinText_Click(this, null);
            }
        }

        //получить бинарный текст
        private String getBin(string unicodeString, Boolean viewText)
        {
            //  //MessageBox.Show("getBin");
            String strBin = "";
            //  string unicodeString = str;
            Encoding unicode = Encoding.Unicode;
            Encoding currentEncoding = Encoding.Unicode;
            String space = "00000000";

            if (r16.Checked)
            {
                currentEncoding = Encoding.Unicode;
                //space = "0000000000000000";                
                // space = "00000000000000000000000000000000";
            }
            else if (r8.Checked)
            {
                currentEncoding = Encoding.GetEncoding(1251);
                //space="00000000";
            }



            byte[] unicodeBytes = unicode.GetBytes(unicodeString);
            byte[] currentBytes = Encoding.Convert(unicode, currentEncoding, unicodeBytes);

            for (var i = 0; i < currentBytes.Length; i++)
            {
                string bin = Convert.ToString(currentBytes[i], 2);
                ////MessageBox.Show(bin);
                if (bin.Length != space.Length)
                {
                    if (bin.Length < space.Length)
                    {
                        bin = space.Substring(bin.Length) + bin;
                    }
                    else
                    {
                        bin = bin.Substring(0, space.Length);
                    }

                }
                //  //MessageBox.Show(bin +" "+bin.Length.ToString());
                strBin += bin;
            }
            //MessageBox.Show("strBin.Length = " + strBin.Length + " currentBytes.Length =" + currentBytes.Length);

            if (viewText)
            {
                char[] currentEncodingChars = new char[currentEncoding.GetCharCount(currentBytes, 0, currentBytes.Length)];
                currentEncoding.GetChars(currentBytes, 0, currentBytes.Length, currentEncodingChars, 0);
                string e1251String = new string(currentEncodingChars);
                tfSecretText.Text = e1251String;
            }
            //  //MessageBox.Show(e1251String);

            return strBin;
        }

        private void rCurrentEncoding_Click(object sender, EventArgs e)
        {
            if (tfSecretText.Enabled) originalSecretText = tfSecretText.Text;
            tfSecretText.Enabled = false;
            getBin(originalSecretText, true);
        }

        private void rOriginalText_Click(object sender, EventArgs e)
        {
            tfSecretText.Text = originalSecretText;
            tfSecretText.Enabled = true;


        }

        private void rBinText_Click(object sender, EventArgs e)
        {
            if (tfSecretText.Enabled) originalSecretText = tfSecretText.Text;
            tfSecretText.Enabled = false;
            tfSecretText.Text = getBin(originalSecretText, false);
        }

        private void cbArxiv_CheckedChanged(object sender, EventArgs e)
        {
            labelKeyArxiv.Visible = cbArxiv.Checked;
            tfKeyArxiv.Visible = cbArxiv.Checked;

        }

        private void bImplant_Click(object sender, EventArgs e)
        {
            String originalText = (rOriginalText.Checked) ? tfSecretText.Text : this.originalSecretText;

            String strBin = getBin(originalText, false);
            // //MessageBox.Show("originalText = "+originalText+" strBin.Length = "+strBin.Length);
            int countCharsDoc = doc.Characters.Count;
            int countCharsBin = strBin.Length;
            int maxStep = countCharsDoc / countCharsBin;

            if (maxStep > 1)
            {

                indexs = getListIndex(strBin, countCharsDoc, countCharsBin, maxStep);

                if (indexs != null)
                {
                    //индикаторы текущего символа  
                    Object startA, endA, startB, endB;

                    Color colorA, colorB;

                    //составляющие цвета
                    int red, green, blue;

                    red = green = blue = 0;



                    byte shiftR1 = Convert.ToByte(tfR1.Text);
                    byte shiftG1 = Convert.ToByte(tfG1.Text);
                    byte shiftB1 = Convert.ToByte(tfB1.Text);
                    byte shiftR0 = Convert.ToByte(tfR0.Text);
                    byte shiftG0 = Convert.ToByte(tfG0.Text);
                    byte shiftB0 = Convert.ToByte(tfB0.Text);


                    if (shiftB0 == shiftB1 && shiftG1 == shiftG0 && shiftR0 == shiftR1)
                    {
                        MessageBox.Show("Внимание. Значения отклонений цвета для символов 0 и 1 должны отличаться хотя бы в одним полем");
                    }
                    else
                    {

                        for (var i = 0; i < strBin.Length; i++)
                        {

                            if (i % 8 == 0)
                            {
                                //Console.Write(i + " ");
                                labelStatusExtract.Text = i + "/" + strBin.Length;
                                labelStatusExtract.Refresh();
                            }

                            int pos = indexs[i];

                            startA = pos - 1;
                            endA = (int)startA + 1;
                            startB = (int)endA;
                            endB = (int)startB + 1;


                            Word.Range rngA = doc.Range(ref startA, ref endA);
                            colorA = ToColor(rngA.Font.Color);


                            Word.Range rngB = doc.Range(ref startB, ref endB);
                            colorB = ToColor(rngB.Font.Color);



                            if (strBin[i] == '0')
                            {

                                red = (colorA.R + shiftR0 > 255) ? colorA.R - shiftR0 : colorA.R + shiftR0;
                                green = (colorA.G + shiftG0 > 255) ? colorA.G - shiftG0 : colorA.G + shiftG0;
                                blue = (colorA.B + shiftB0 > 255) ? colorA.B - shiftB0 : colorA.B + shiftB0;
                                //Console.Write(" red 0 = " + red);
                            }
                            else if (strBin[i] == '1')
                            {
                                red = (colorA.R + shiftR1 > 255) ? colorA.R - shiftR1 : colorA.R + shiftR1;
                                green = (colorA.G + shiftG1 > 255) ? colorA.G - shiftG1 : colorA.G + shiftG1;
                                blue = (colorA.B + shiftB1 > 255) ? colorA.B - shiftB1 : colorA.B + shiftB1;
                                //Console.Write(" red 1 = " + red);
                            }

                            // Console.Write("\nimplant = " + pos);//color: " + red + " " + green + " " + blue);

                            //   Console.Write("color: " + red+" "+green+" "+blue);
                            rngB.Font.Color = (Microsoft.Office.Interop.Word.WdColor)Microsoft.VisualBasic.Information.RGB(red, green, blue);
                            //      rngB.Font.Shading.BackgroundPatternColorIndex = Word.WdColorIndex.wdBlue;
                        }

                        labelStatusExtract.Text = "";

                        MessageBox.Show("текст успешно внедрен");
                    }
                }
                else
                {
                    MessageBox.Show("Не удалось внедрить текст");
                }
            }
            else
            {
                MessageBox.Show("В документе не хватает " + (countCharsBin * 2 - countCharsDoc) + " символов для скрытия текста");
            }





            ////MessageBox.Show("access = " + countCharsDoc + " bin = " + countBin);
        }

        public Color ToColor(Word.WdColor originalColor)
        {
            // Cast to numeric value so we can isolate RGBA elements
            int wordColor = (int)originalColor;
            //MessageBox.Show(((uint)originalColor).ToString());
            // Isolate alpha element. Shift right to set its range to [0-255].
            int alphaTemp = (int)((wordColor & 0xFF000000) >> 24);
            // Check that it's not completely transparent. If so, make it visible.
            int alpha = (alphaTemp == 0) ? 255 : alphaTemp;

            // Isolate R,G,B elements.
            int r = (wordColor & 0x000000FF);
            int g = ((wordColor & 0x0000FF00) >> 8);
            int b = ((wordColor & 0x00FF0000) >> 16);

            return Color.FromArgb(alpha, r, g, b);
        }

        private List<int> getListIndex(string strBin, int countCharsDoc, int countCharsBin, int maxStep)
        {
            List<int> indexs = new List<int>();

            Object startA, endA, startB, endB;
            startA = -2;
            Random wRnd = new Random(DateTime.Now.Millisecond);


            //внедрение символов
            int countAttempt = 0;
            Boolean isLimit = false;
            Console.Write("\n\n\nmaxStep = " + maxStep + "");
            do
            {
                isLimit = false;
                indexs = new List<int>();
                int shift = maxStep * 2 - 2 - countAttempt;
                countAttempt++;
                Console.Write("\nshift= " + shift + " \n steps = ");
                //MessageBox.Show(countAttempt.ToString());
                //int shift = (int)((maxStep - 2) - 0.2 * countAttempt);
                //if (maxStep + shift < 2) shift = -maxStep + 2;
                for (var i = 0; i < strBin.Length; i++)
                {
                    //расстояние для следующего символа
                    int step = wRnd.Next(2, shift);
                    Console.Write(step + ",");

                    startA = (int)startA + step;
                    endA = (int)startA + 1;
                    startB = (int)endA;
                    endB = (int)startB + 1;

                    if ((int)startB < countCharsDoc)
                    {
                        //предыдущий символ
                        Word.Range rngA = doc.Range(ref startA, ref endA);

                        //изменяемый символ
                        Word.Range rngB = doc.Range(ref startB, ref endB);


                        while (checkChars(rngA.Text) && rPrint.Checked && checkChars(rngB.Text))
                        {

                            startA = (int)startA + 1;
                            endA = (int)startA + 1;
                            startB = (int)endA;
                            endB = (int)startB + 1;

                            rngA = doc.Range(ref startA, ref endA);
                            rngB = doc.Range(ref startB, ref endB);

                            if ((int)startB >= countCharsDoc)
                            {
                                isLimit = true;
                                //MessageBox.Show("LIMIT");
                                break;
                            }
                        }

                        indexs.Add((int)startB);

                    }
                    else
                    {
                        //  MessageBox.Show("LIMIT");
                        isLimit = true;
                        break;
                    }
                }
            } while (isLimit && countAttempt < 10);
            if (countAttempt == 10) indexs = null;
            return indexs;
        }

        private bool checkChars(string str)
        {
            Boolean flag = true;
            if (str == " " || str == "\t" || str == "\n" || str == "\r") flag = false;
            return flag;
        }

        private void bViewImplant_Click(object sender, EventArgs e)
        {


            if (indexs != null)
            {
                Object startA, endA, startB, endB;
                Word.Range rngA, rngB;
                Boolean clear = (bViewImplant.Text == "отметить") ? false : true;
                foreach (int index in indexs)
                {
                    startA = index;
                    endA = (int)startA + 1;
                    rngA = doc.Range(ref startA, ref endA);
                    if (clear)
                    {
                        endB = startA;
                        startB = (int)endB - 1;
                        rngB = doc.Range(ref startB, ref endB);
                        rngA.Font.Shading.BackgroundPatternColorIndex = rngB.Font.Shading.BackgroundPatternColorIndex;
                    }
                    else rngA.Font.Shading.BackgroundPatternColorIndex = Word.WdColorIndex.wdBlue;
                }
                if (clear) bViewImplant.Text = "отметить";
                else bViewImplant.Text = "очисить";
            }
        }

        private void bExtract_Click(object sender, EventArgs e)
        {
            labelStatusExtract.Text = "извлечение..";
            String binText = extractBin();
            labelStatusExtract.Text = "";
            tfSecretText.Text = binText;
            String originalText = "";
            Encoding currentEncoding = getCurrentEncoding();

            originalText = binToString(binText, currentEncoding, 8);
            //   originalText = BinToString(binText, currentEncoding);

            /*
            for (var i = 0; i <= binText.Length - size; i += size)
            {
                bin = binText.Substring(i, size);
                int num = Convert.ToInt32(bin, 2);
                byte[] currentBytes = BitConverter.GetBytes(num);

                char[] currentEncodingChars = new char[currentEncoding.GetCharCount(currentBytes, 0, currentBytes.Length)];
                currentEncoding.GetChars(currentBytes, 0, currentBytes.Length, currentEncodingChars, 0);
                string e1251String = new string(currentEncodingChars);
                originalText += e1251String;
            }
            */
            tfSecretText.Text = originalText;

            if (originalText.Length == 0) MessageBox.Show("при данных настройка скрытого текста не обнаружено");
            else MessageBox.Show("текст извлечен");
         
        }

        private Encoding getCurrentEncoding()
        {
            Encoding encoding = Encoding.Unicode;
            if (r16.Checked)
            {
                encoding = Encoding.Unicode;

            }
            else if (r8.Checked)
            {
                encoding = Encoding.GetEncoding(1251);

            }


            return encoding;
        }

        private String extractBin()
        {
            //индикаторы текущего символа  

            String strBin = "";
            Object startA, endA, startB, endB;

            //составляющие цвета
            // int red, green, blue;

            Color colorA, colorB;

            //   red = green = blue = 0;

            byte shiftR1 = Convert.ToByte(tfR1.Text);
            byte shiftG1 = Convert.ToByte(tfG1.Text);
            byte shiftB1 = Convert.ToByte(tfB1.Text);
            byte shiftR0 = Convert.ToByte(tfR0.Text);
            byte shiftG0 = Convert.ToByte(tfG0.Text);
            byte shiftB0 = Convert.ToByte(tfB0.Text);

            if (shiftB0 == shiftB1 && shiftG1 == shiftG0 && shiftR0 == shiftR1)
            {
                MessageBox.Show("Внимание. Значения отклонений цвета для символов 0 и 1 должны отличаться хотя бы в одним полем");
            }
            else
            {
                byte shiftR, shiftG, shiftB;

                int count = doc.Characters.Count;


                for (var i = 0; i < count - 1; i++)
                {


                    if (i % 50 == 0)
                    {
                        //Console.Write(i + " ");
                        labelStatusExtract.Text = i + "/" + count;
                        labelStatusExtract.Refresh();
                    }

                    startA = i;
                    endA = (int)startA + 1;
                    startB = (int)endA;
                    endB = (int)startB + 1;

                    Word.Range rngA = doc.Range(ref startA, ref endA);
                    colorA = ToColor(rngA.Font.Color);


                    Word.Range rngB = doc.Range(ref startB, ref endB);
                    colorB = ToColor(rngB.Font.Color);

                    //  Console.Write("\n colorA(" + ((int)startA) + "):" + colorA.R + " " + colorA.G + " " + colorA.B + "colorB:(" + ((int)startB) + ")" + colorB.R + " " + colorB.G + " " + colorB.B);
                    if (colorA != colorB)
                    {

                        shiftR = (Convert.ToInt16(colorA.R) + Convert.ToInt16(shiftR0) > 255) ? (byte)(colorA.R - colorB.R) : (byte)(colorB.R - colorA.R);
                        shiftG = (Convert.ToInt16(colorA.G) + Convert.ToInt16(shiftG0) > 255) ? (byte)(colorA.G - colorB.G) : (byte)(colorB.G - colorA.G);
                        shiftB = (Convert.ToInt16(colorA.B) + Convert.ToInt16(shiftB0) > 255) ? (byte)(colorA.B - colorB.B) : (byte)(colorB.B - colorA.B);

                        //Console.Write("shift = " + shiftR + " " + shiftG + " " + shiftB);

                        if (shiftR == shiftR1 && shiftG1 == shiftG && shiftB == shiftB1)
                        {
                            strBin += '1';
                            Console.Write("\n 1 extract = " + ((int)startB).ToString() + "\n");
                        }
                        else if (shiftR == shiftR0 && shiftG0 == shiftG && shiftB == shiftB0)
                        {
                            strBin += '0';
                            Console.Write("\n 0 extract = " + ((int)startB).ToString() + "\n");
                        }

                    }
                }
            }

            return strBin;
        }

        private void bShowDoc_Click(object sender, EventArgs e)
        {
            if (officeWord.Visible)
            {
                officeWord.Visible = false;
                bShowDoc.Text = "показать";

            }
            else
            {
                officeWord.Visible = true;
                bShowDoc.Text = "скрыть";

            }
        }

        private void bSaveDoc_Click(object sender, EventArgs e)
        {
            saveDoc(pathDoc);
        }

        private void bSaveAsDoc_Click(object sender, EventArgs e)
        {

            SaveFileDialog saveFileDialog = new SaveFileDialog();
            saveFileDialog.FileName = pathDoc;
            if (saveFileDialog.ShowDialog() == DialogResult.OK)
            {
                saveDoc(saveFileDialog.FileName);
            }

        }

        private void saveDoc(string path)
        {
            Object fileName = path;
            Object fileFormat = Type.Missing;
            Object lockComments = Type.Missing;
            Object password = Type.Missing;
            Object addToRecentFiles = Type.Missing;
            Object writePassword = Type.Missing;
            Object readOnlyRecommended = Type.Missing;
            Object embedTrueTypeFonts = Type.Missing;
            Object saveNativePictureFormat = Type.Missing;
            Object saveFormsData = Type.Missing;
            Object saveAsAOCELetter = Type.Missing;
            Object encoding = Type.Missing;
            Object insertLineBreaks = Type.Missing;
            Object allowSubstitutions = Type.Missing;
            Object lineEnding = Type.Missing;
            Object addBiDiMarks = Type.Missing;

            doc.SaveAs(ref fileName, ref fileFormat, ref lockComments,
            ref password, ref addToRecentFiles, ref writePassword,
            ref readOnlyRecommended, ref embedTrueTypeFonts,
            ref saveNativePictureFormat, ref saveFormsData,
            ref saveAsAOCELetter, ref encoding, ref insertLineBreaks,
            ref allowSubstitutions, ref lineEnding, ref addBiDiMarks);
        }

        private void changeEncoding(object sender, EventArgs e)
        {
            setEncoding();
        }

        //загрузка программы Microsoft Office Word
        private void initOfficeWord()
        {
            officeWord = new Microsoft.Office.Interop.Word.Application();
            officeWord.DocumentBeforeClose += new Microsoft.Office.Interop.Word.ApplicationEvents4_DocumentBeforeCloseEventHandler(wa_DocumentBeforeClose);
        }
      
        private void wa_DocumentBeforeClose(Word.Document Doc, ref bool Cancel)
        {
            closeDoc(doc);
            officeWord.Visible = false;
            this.demoThread = new Thread(new ThreadStart(this.ThreadProcSafe));
            this.demoThread.Start();
        }

        private void ThreadProcSafe()
        {
            this.changeAfterUserClose(false);
        }

        private void changeAfterUserClose(bool flag)
        {
            if (this.pictureBoxLogoWord.InvokeRequired)
            {
                SetTextCallback d = new SetTextCallback(changeAfterUserClose);
                this.Invoke(d, new object[] { flag });
            }
            else
            {
                changeViewWordFace(flag);
                doc = null;
            }
        }

        private void bGetFileSecretText_Click(object sender, EventArgs e)
        {
            OpenFileDialog openFileDialog = new OpenFileDialog();
            openFileDialog.Filter = "Документ (.doc, .docx, .rtf, .odt, .txt)|*.docx;*.doc;*.rtf;*.odt;*.txt|Word документы|*.docx;*.doc;|Текствые файлы|*.txt|Все файлы|*.*";
            if (openFileDialog.ShowDialog() == DialogResult.OK)
            {
                String path = openFileDialog.FileName;
                Word.Document doc = openDoc(path);
                Object begin = Type.Missing;
                Object end = Type.Missing;
                Word.Range wordrange = doc.Range(ref begin, ref end);
                originalSecretText = wordrange.Text;
                if (rOriginalText.Checked) tfSecretText.Text = originalSecretText;
                setEncoding();
                // tfSecretText.Text = wordrange.Text;
                closeDoc(doc);

                /*
                if (System.IO.Path.GetExtension(path) == ".txt")
                {

                    System.IO.StreamReader sr = System.IO.File.OpenText(path);
                    tfSecretText.Text = sr.ReadToEnd();
                }
                */
            }
        }

        //закрытие документа Microsoft Office Word
        private void closeDoc(Microsoft.Office.Interop.Word.Document doc)
        {

            object sch = Word.WdSaveOptions.wdDoNotSaveChanges;
            object aq = Type.Missing;
            object ab = Type.Missing;

            (doc as Microsoft.Office.Interop.Word._Document).Close(ref sch, ref aq, ref ab);
        }

        //закрытие приложения Microsoft Office Word
        private void exitOfficeWord()
        {
            object sch = Type.Missing;
            object aq = Type.Missing;
            object ab = Type.Missing;
            (officeWord as Microsoft.Office.Interop.Word._Application).Quit(ref sch, ref aq, ref ab);
        }

        private Microsoft.Office.Interop.Word.Document openDoc(string path)
        {
            Object filename = path;
            Object confirmConversions = Type.Missing;
            Object readOnly = Type.Missing;
            Object addToRecentFiles = Type.Missing;
            Object passwordDocument = Type.Missing;
            Object passwordTemplate = Type.Missing;
            Object revert = Type.Missing;
            Object writePasswordDocument = Type.Missing;
            Object writePasswordTemplate = Type.Missing;
            Object format = Type.Missing;
            Object encoding = Type.Missing;
            Object visible = Type.Missing;
            Object openConflictDocument = Type.Missing;
            Object openAndRepair = Type.Missing;
            Object documentDirection = Type.Missing;
            Object noEncodingDialog = Type.Missing;


            officeWord.Documents.Open(ref filename,
            ref confirmConversions,
            ref readOnly,
            ref addToRecentFiles,
            ref passwordDocument,
            ref passwordTemplate,
            ref revert,
            ref writePasswordDocument,
            ref writePasswordTemplate,
            ref format,
            ref encoding,
            ref visible,
            ref openConflictDocument,
            ref openAndRepair,
            ref documentDirection,
            ref noEncodingDialog);

            Word.Document doc = officeWord.Documents.Application.ActiveDocument; //new Microsoft.Office.Interop.Word.Document();
            // doc = officeWord.Documents.Application.ActiveDocument;
            return doc;
        }

        private void bGetDoc_Click(object sender, EventArgs e)
        {
            OpenFileDialog openFileDialog = new OpenFileDialog();
            openFileDialog.Filter = "Документы Word|*.docx;*.doc;|rtf, odt|*.rtf;*.odt|Все файлы|*.*";
            if (openFileDialog.ShowDialog() == DialogResult.OK)
            {

                if (doc != null)
                {
                    // MessageBox.Show("close doc");
                    closeDoc(doc);
                }
                pathDoc = openFileDialog.FileName;
                loadWord(pathDoc);
                
            }
        }

        private void loadWord(string path)
        {
            doc = openDoc(path);
            changeViewWordFace(true);


        }

        private void changeViewWordFace(bool view)
        {

            pictureBoxLogoWord.Visible = view;
            bShowDoc.Visible = view;
            bSaveDoc.Visible = view;
            bSaveAsDoc.Visible = view;
            bImplant.Visible = view;
            bExtract.Visible = view;
            bViewImplant.Visible = view;
        }

        private void Sword_FormClosed(object sender, FormClosedEventArgs e)
        {
            officeWord.DocumentBeforeClose -= new Microsoft.Office.Interop.Word.ApplicationEvents4_DocumentBeforeCloseEventHandler(wa_DocumentBeforeClose);

            if (doc != null)
            {
                closeDoc(doc);
            }

            exitOfficeWord();
        }

        private void button6_Click(object sender, EventArgs e)
        {
            String key = "";

            key += "bit=";
            key += (r16.Checked) ? "16" : "8";
            key += "|";

            key += "arxiv=";
            key += (cbArxiv.Checked) ? key += tfKeyArxiv.Text : "none";
            key += "|";

            key += "color=";
            key += tfR0.Text + "," + tfG0.Text + "," + tfB0.Text + "&" + tfR1.Text + "," + tfG1.Text + "," + tfB1.Text;
            key += "|";

            key += "type=";
            key += (rPrint.Checked) ? "print" : "electro";
            //key += "|";


            SaveFileDialog saveFileDialog = new SaveFileDialog();

            saveFileDialog.Filter = "SWord-ключ|*.sword";
            if (saveFileDialog.ShowDialog() == DialogResult.OK)
            {
                String path = saveFileDialog.FileName;
                System.IO.StreamWriter fout = new System.IO.StreamWriter(path);
                fout.Write(key);
                fout.Close();
            }
        }

        private void button5_Click(object sender, EventArgs e)
        {
            OpenFileDialog openFileDialog = new OpenFileDialog();
            openFileDialog.Filter = "SWord-ключ|*.sword";
            if (openFileDialog.ShowDialog() == DialogResult.OK)
            {
                String path = openFileDialog.FileName;

                System.IO.StreamReader sr = new System.IO.StreamReader(path);
                String key = sr.ReadToEnd();
                sr.Close();

                //string[] sets = key.Split('|');
                //bit=8|arxiv=none|color=1,100,1&1,1,100|type=electro
                //string pattern = @"^bit=(\d+)\|arxiv=(none|\d+)\|color=(\d+),(\d+),(\d+)\&(\d+),(\d+),(\d+)\|type=(electro|print)$";
                string pattern = @"^bit=(\d+)\|arxiv=(none|\d+)\|color=(\d+),(\d+),(\d+)\&(\d+),(\d+),(\d+)\|type=(electro|print)$";
                Match match = Regex.Match(key, pattern, RegexOptions.IgnoreCase | RegexOptions.Multiline);
                if (match.Success)
                {
                    ////MessageBox.Show("ok");

                    if (match.Groups[1].Value == "16") r16.Checked = true;
                    else if (match.Groups[1].Value == "8") r8.Checked = true;
                    //    //MessageBox.Show(match.Groups[1].Value);

                    if (match.Groups[2].Value == "none") cbArxiv.Checked = false;
                    else
                    {
                        cbArxiv.Checked = true;
                        tfKeyArxiv.Text = match.Groups[2].Value;
                    }

                    tfR0.Text = match.Groups[3].Value;
                    tfG0.Text = match.Groups[4].Value;
                    tfB0.Text = match.Groups[5].Value;
                    tfR1.Text = match.Groups[6].Value;
                    tfG1.Text = match.Groups[7].Value;
                    tfB1.Text = match.Groups[8].Value;

                    if (match.Groups[9].Value == "print") rPrint.Checked = true;
                    else rElectro.Checked = true;
                }
            }
        }

        private void rCurrentEncoding_CheckedChanged(object sender, EventArgs e)
        {

        }

        private void r8_CheckedChanged(object sender, EventArgs e)
        {

        }
    }
}