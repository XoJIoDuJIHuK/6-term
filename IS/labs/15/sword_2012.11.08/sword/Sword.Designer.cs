namespace sword
{
    partial class Sword
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Sword));
            this.tfSecretText = new System.Windows.Forms.TextBox();
            this.bGetFileSecretText = new System.Windows.Forms.Button();
            this.bGetDoc = new System.Windows.Forms.Button();
            this.pictureBoxLogoWord = new System.Windows.Forms.PictureBox();
            this.bImplant = new System.Windows.Forms.Button();
            this.bExtract = new System.Windows.Forms.Button();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.rCurrentEncoding = new System.Windows.Forms.RadioButton();
            this.rBinText = new System.Windows.Forms.RadioButton();
            this.rOriginalText = new System.Windows.Forms.RadioButton();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.bSaveAsDoc = new System.Windows.Forms.Button();
            this.bSaveDoc = new System.Windows.Forms.Button();
            this.bShowDoc = new System.Windows.Forms.Button();
            this.groupBox3 = new System.Windows.Forms.GroupBox();
            this.groupBox4 = new System.Windows.Forms.GroupBox();
            this.rPrint = new System.Windows.Forms.RadioButton();
            this.rElectro = new System.Windows.Forms.RadioButton();
            this.button6 = new System.Windows.Forms.Button();
            this.groupBox5 = new System.Windows.Forms.GroupBox();
            this.labelKeyArxiv = new System.Windows.Forms.Label();
            this.tfKeyArxiv = new System.Windows.Forms.TextBox();
            this.cbArxiv = new System.Windows.Forms.CheckBox();
            this.r8 = new System.Windows.Forms.RadioButton();
            this.r16 = new System.Windows.Forms.RadioButton();
            this.groupBox6 = new System.Windows.Forms.GroupBox();
            this.label6 = new System.Windows.Forms.Label();
            this.label7 = new System.Windows.Forms.Label();
            this.label8 = new System.Windows.Forms.Label();
            this.tfB0 = new System.Windows.Forms.TextBox();
            this.tfG0 = new System.Windows.Forms.TextBox();
            this.label9 = new System.Windows.Forms.Label();
            this.tfR0 = new System.Windows.Forms.TextBox();
            this.label5 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.tfB1 = new System.Windows.Forms.TextBox();
            this.tfG1 = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.tfR1 = new System.Windows.Forms.TextBox();
            this.button5 = new System.Windows.Forms.Button();
            this.bViewImplant = new System.Windows.Forms.Button();
            this.labelStatusExtract = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBoxLogoWord)).BeginInit();
            this.groupBox1.SuspendLayout();
            this.groupBox2.SuspendLayout();
            this.groupBox3.SuspendLayout();
            this.groupBox4.SuspendLayout();
            this.groupBox5.SuspendLayout();
            this.groupBox6.SuspendLayout();
            this.SuspendLayout();
            // 
            // tfSecretText
            // 
            this.tfSecretText.Location = new System.Drawing.Point(18, 43);
            this.tfSecretText.Multiline = true;
            this.tfSecretText.Name = "tfSecretText";
            this.tfSecretText.Size = new System.Drawing.Size(315, 99);
            this.tfSecretText.TabIndex = 0;
            // 
            // bGetFileSecretText
            // 
            this.bGetFileSecretText.Location = new System.Drawing.Point(232, 13);
            this.bGetFileSecretText.Name = "bGetFileSecretText";
            this.bGetFileSecretText.Size = new System.Drawing.Size(101, 23);
            this.bGetFileSecretText.TabIndex = 1;
            this.bGetFileSecretText.Text = "взять из файла";
            this.bGetFileSecretText.UseVisualStyleBackColor = true;
            this.bGetFileSecretText.Click += new System.EventHandler(this.bGetFileSecretText_Click);
            // 
            // bGetDoc
            // 
            this.bGetDoc.Location = new System.Drawing.Point(21, 23);
            this.bGetDoc.Name = "bGetDoc";
            this.bGetDoc.Size = new System.Drawing.Size(111, 23);
            this.bGetDoc.TabIndex = 4;
            this.bGetDoc.Text = "выбор документа";
            this.bGetDoc.UseVisualStyleBackColor = true;
            this.bGetDoc.Click += new System.EventHandler(this.bGetDoc_Click);
            // 
            // pictureBoxLogoWord
            // 
            this.pictureBoxLogoWord.Image = ((System.Drawing.Image)(resources.GetObject("pictureBoxLogoWord.Image")));
            this.pictureBoxLogoWord.Location = new System.Drawing.Point(21, 52);
            this.pictureBoxLogoWord.Name = "pictureBoxLogoWord";
            this.pictureBoxLogoWord.Size = new System.Drawing.Size(111, 100);
            this.pictureBoxLogoWord.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.pictureBoxLogoWord.TabIndex = 43;
            this.pictureBoxLogoWord.TabStop = false;
            // 
            // bImplant
            // 
            this.bImplant.Location = new System.Drawing.Point(375, 75);
            this.bImplant.Name = "bImplant";
            this.bImplant.Size = new System.Drawing.Size(101, 23);
            this.bImplant.TabIndex = 44;
            this.bImplant.Text = "внедрить >>";
            this.bImplant.UseVisualStyleBackColor = true;
            this.bImplant.Click += new System.EventHandler(this.bImplant_Click);
            // 
            // bExtract
            // 
            this.bExtract.Location = new System.Drawing.Point(375, 116);
            this.bExtract.Name = "bExtract";
            this.bExtract.Size = new System.Drawing.Size(101, 23);
            this.bExtract.TabIndex = 45;
            this.bExtract.Text = "<< извлечь";
            this.bExtract.UseVisualStyleBackColor = true;
            this.bExtract.Click += new System.EventHandler(this.bExtract_Click);
            // 
            // groupBox1
            // 
            this.groupBox1.BackColor = System.Drawing.SystemColors.Control;
            this.groupBox1.Controls.Add(this.rCurrentEncoding);
            this.groupBox1.Controls.Add(this.rBinText);
            this.groupBox1.Controls.Add(this.rOriginalText);
            this.groupBox1.Controls.Add(this.tfSecretText);
            this.groupBox1.Controls.Add(this.bGetFileSecretText);
            this.groupBox1.Location = new System.Drawing.Point(12, 12);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(348, 167);
            this.groupBox1.TabIndex = 46;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Текст для скрытия";
            // 
            // rCurrentEncoding
            // 
            this.rCurrentEncoding.AutoSize = true;
            this.rCurrentEncoding.Location = new System.Drawing.Point(103, 146);
            this.rCurrentEncoding.Name = "rCurrentEncoding";
            this.rCurrentEncoding.Size = new System.Drawing.Size(125, 17);
            this.rCurrentEncoding.TabIndex = 38;
            this.rCurrentEncoding.Text = "текущая кодировка";
            this.rCurrentEncoding.UseVisualStyleBackColor = true;
            this.rCurrentEncoding.Click += new System.EventHandler(this.rCurrentEncoding_Click);
            this.rCurrentEncoding.CheckedChanged += new System.EventHandler(this.rCurrentEncoding_CheckedChanged);
            // 
            // rBinText
            // 
            this.rBinText.AutoSize = true;
            this.rBinText.Location = new System.Drawing.Point(238, 146);
            this.rBinText.Name = "rBinText";
            this.rBinText.Size = new System.Drawing.Size(95, 17);
            this.rBinText.TabIndex = 37;
            this.rBinText.Text = "двоичный вид";
            this.rBinText.UseVisualStyleBackColor = true;
            this.rBinText.Click += new System.EventHandler(this.rBinText_Click);
            // 
            // rOriginalText
            // 
            this.rOriginalText.AutoSize = true;
            this.rOriginalText.Checked = true;
            this.rOriginalText.Location = new System.Drawing.Point(19, 146);
            this.rOriginalText.Name = "rOriginalText";
            this.rOriginalText.Size = new System.Drawing.Size(72, 17);
            this.rOriginalText.TabIndex = 36;
            this.rOriginalText.TabStop = true;
            this.rOriginalText.Text = "оригинал";
            this.rOriginalText.UseVisualStyleBackColor = true;
            this.rOriginalText.Click += new System.EventHandler(this.rOriginalText_Click);
            // 
            // groupBox2
            // 
            this.groupBox2.BackColor = System.Drawing.SystemColors.Control;
            this.groupBox2.Controls.Add(this.bSaveAsDoc);
            this.groupBox2.Controls.Add(this.bSaveDoc);
            this.groupBox2.Controls.Add(this.bGetDoc);
            this.groupBox2.Controls.Add(this.bShowDoc);
            this.groupBox2.Controls.Add(this.pictureBoxLogoWord);
            this.groupBox2.Location = new System.Drawing.Point(482, 15);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(372, 164);
            this.groupBox2.TabIndex = 47;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Документ в который нужно скрыть (извлечь) данные";
            // 
            // bSaveAsDoc
            // 
            this.bSaveAsDoc.Location = new System.Drawing.Point(147, 108);
            this.bSaveAsDoc.Name = "bSaveAsDoc";
            this.bSaveAsDoc.RightToLeft = System.Windows.Forms.RightToLeft.No;
            this.bSaveAsDoc.Size = new System.Drawing.Size(100, 23);
            this.bSaveAsDoc.TabIndex = 51;
            this.bSaveAsDoc.Text = "сохранить как";
            this.bSaveAsDoc.UseVisualStyleBackColor = true;
            this.bSaveAsDoc.Click += new System.EventHandler(this.bSaveAsDoc_Click);
            // 
            // bSaveDoc
            // 
            this.bSaveDoc.Location = new System.Drawing.Point(147, 80);
            this.bSaveDoc.Name = "bSaveDoc";
            this.bSaveDoc.RightToLeft = System.Windows.Forms.RightToLeft.No;
            this.bSaveDoc.Size = new System.Drawing.Size(100, 23);
            this.bSaveDoc.TabIndex = 50;
            this.bSaveDoc.Text = "сохранить";
            this.bSaveDoc.UseVisualStyleBackColor = true;
            this.bSaveDoc.Click += new System.EventHandler(this.bSaveDoc_Click);
            // 
            // bShowDoc
            // 
            this.bShowDoc.Location = new System.Drawing.Point(147, 53);
            this.bShowDoc.Name = "bShowDoc";
            this.bShowDoc.RightToLeft = System.Windows.Forms.RightToLeft.No;
            this.bShowDoc.Size = new System.Drawing.Size(100, 23);
            this.bShowDoc.TabIndex = 49;
            this.bShowDoc.Text = "показать";
            this.bShowDoc.UseVisualStyleBackColor = true;
            this.bShowDoc.Click += new System.EventHandler(this.bShowDoc_Click);
            // 
            // groupBox3
            // 
            this.groupBox3.Controls.Add(this.groupBox4);
            this.groupBox3.Controls.Add(this.button6);
            this.groupBox3.Controls.Add(this.groupBox5);
            this.groupBox3.Controls.Add(this.groupBox6);
            this.groupBox3.Controls.Add(this.button5);
            this.groupBox3.Location = new System.Drawing.Point(134, 185);
            this.groupBox3.Name = "groupBox3";
            this.groupBox3.Size = new System.Drawing.Size(492, 328);
            this.groupBox3.TabIndex = 48;
            this.groupBox3.TabStop = false;
            this.groupBox3.Text = "Настройка";
            // 
            // groupBox4
            // 
            this.groupBox4.Controls.Add(this.rPrint);
            this.groupBox4.Controls.Add(this.rElectro);
            this.groupBox4.Location = new System.Drawing.Point(20, 263);
            this.groupBox4.Name = "groupBox4";
            this.groupBox4.Size = new System.Drawing.Size(280, 58);
            this.groupBox4.TabIndex = 27;
            this.groupBox4.TabStop = false;
            this.groupBox4.Text = "Тип носителя";
            // 
            // rPrint
            // 
            this.rPrint.AutoSize = true;
            this.rPrint.Location = new System.Drawing.Point(141, 20);
            this.rPrint.Name = "rPrint";
            this.rPrint.Size = new System.Drawing.Size(78, 17);
            this.rPrint.TabIndex = 26;
            this.rPrint.Text = "бумажный";
            this.rPrint.UseVisualStyleBackColor = true;
            // 
            // rElectro
            // 
            this.rElectro.AutoSize = true;
            this.rElectro.Checked = true;
            this.rElectro.Location = new System.Drawing.Point(16, 20);
            this.rElectro.Name = "rElectro";
            this.rElectro.Size = new System.Drawing.Size(93, 17);
            this.rElectro.TabIndex = 25;
            this.rElectro.TabStop = true;
            this.rElectro.Text = "Электронный";
            this.rElectro.UseVisualStyleBackColor = true;
            // 
            // button6
            // 
            this.button6.Location = new System.Drawing.Point(398, 274);
            this.button6.Name = "button6";
            this.button6.Size = new System.Drawing.Size(82, 48);
            this.button6.TabIndex = 28;
            this.button6.Text = "сохранить в файл";
            this.button6.UseVisualStyleBackColor = true;
            this.button6.Click += new System.EventHandler(this.button6_Click);
            // 
            // groupBox5
            // 
            this.groupBox5.Controls.Add(this.labelKeyArxiv);
            this.groupBox5.Controls.Add(this.tfKeyArxiv);
            this.groupBox5.Controls.Add(this.cbArxiv);
            this.groupBox5.Controls.Add(this.r8);
            this.groupBox5.Controls.Add(this.r16);
            this.groupBox5.Location = new System.Drawing.Point(20, 19);
            this.groupBox5.Name = "groupBox5";
            this.groupBox5.Size = new System.Drawing.Size(372, 110);
            this.groupBox5.TabIndex = 26;
            this.groupBox5.TabStop = false;
            this.groupBox5.Text = "Число знаков на символ";
            // 
            // labelKeyArxiv
            // 
            this.labelKeyArxiv.AutoSize = true;
            this.labelKeyArxiv.Location = new System.Drawing.Point(261, 66);
            this.labelKeyArxiv.Name = "labelKeyArxiv";
            this.labelKeyArxiv.Size = new System.Drawing.Size(44, 13);
            this.labelKeyArxiv.TabIndex = 37;
            this.labelKeyArxiv.Text = "ключ = ";
            // 
            // tfKeyArxiv
            // 
            this.tfKeyArxiv.Location = new System.Drawing.Point(305, 63);
            this.tfKeyArxiv.Name = "tfKeyArxiv";
            this.tfKeyArxiv.Size = new System.Drawing.Size(47, 20);
            this.tfKeyArxiv.TabIndex = 36;
            // 
            // cbArxiv
            // 
            this.cbArxiv.AutoSize = true;
            this.cbArxiv.Location = new System.Drawing.Point(221, 40);
            this.cbArxiv.Name = "cbArxiv";
            this.cbArxiv.Size = new System.Drawing.Size(137, 17);
            this.cbArxiv.TabIndex = 27;
            this.cbArxiv.Text = "использовать сжатие";
            this.cbArxiv.UseVisualStyleBackColor = true;
            this.cbArxiv.Visible = false;
            this.cbArxiv.CheckedChanged += new System.EventHandler(this.cbArxiv_CheckedChanged);
            // 
            // r8
            // 
            this.r8.AutoSize = true;
            this.r8.Location = new System.Drawing.Point(14, 44);
            this.r8.Name = "r8";
            this.r8.Size = new System.Drawing.Size(86, 17);
            this.r8.TabIndex = 30;
            this.r8.Text = "8 (англ+рус)";
            this.r8.UseVisualStyleBackColor = true;
            this.r8.Click += new System.EventHandler(this.changeEncoding);
            this.r8.CheckedChanged += new System.EventHandler(this.r8_CheckedChanged);
            // 
            // r16
            // 
            this.r16.AutoSize = true;
            this.r16.Checked = true;
            this.r16.Location = new System.Drawing.Point(14, 21);
            this.r16.Name = "r16";
            this.r16.Size = new System.Drawing.Size(86, 17);
            this.r16.TabIndex = 26;
            this.r16.TabStop = true;
            this.r16.Text = "16 (Unicode)";
            this.r16.UseVisualStyleBackColor = true;
            this.r16.Click += new System.EventHandler(this.changeEncoding);
            // 
            // groupBox6
            // 
            this.groupBox6.Controls.Add(this.label6);
            this.groupBox6.Controls.Add(this.label7);
            this.groupBox6.Controls.Add(this.label8);
            this.groupBox6.Controls.Add(this.tfB0);
            this.groupBox6.Controls.Add(this.tfG0);
            this.groupBox6.Controls.Add(this.label9);
            this.groupBox6.Controls.Add(this.tfR0);
            this.groupBox6.Controls.Add(this.label5);
            this.groupBox6.Controls.Add(this.label4);
            this.groupBox6.Controls.Add(this.label3);
            this.groupBox6.Controls.Add(this.tfB1);
            this.groupBox6.Controls.Add(this.tfG1);
            this.groupBox6.Controls.Add(this.label2);
            this.groupBox6.Controls.Add(this.tfR1);
            this.groupBox6.Location = new System.Drawing.Point(20, 135);
            this.groupBox6.Name = "groupBox6";
            this.groupBox6.Size = new System.Drawing.Size(280, 122);
            this.groupBox6.TabIndex = 27;
            this.groupBox6.TabStop = false;
            this.groupBox6.Text = "Величина отклонения цвета (от 0 до 127)";
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(164, 66);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(13, 13);
            this.label6.TabIndex = 31;
            this.label6.Text = "b";
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(114, 66);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(13, 13);
            this.label7.TabIndex = 30;
            this.label7.Text = "g";
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(66, 66);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(10, 13);
            this.label8.TabIndex = 29;
            this.label8.Text = "r";
            // 
            // tfB0
            // 
            this.tfB0.Font = new System.Drawing.Font("Microsoft Sans Serif", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.tfB0.Location = new System.Drawing.Point(149, 82);
            this.tfB0.Name = "tfB0";
            this.tfB0.Size = new System.Drawing.Size(42, 22);
            this.tfB0.TabIndex = 28;
            // 
            // tfG0
            // 
            this.tfG0.Font = new System.Drawing.Font("Microsoft Sans Serif", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.tfG0.Location = new System.Drawing.Point(99, 82);
            this.tfG0.Name = "tfG0";
            this.tfG0.Size = new System.Drawing.Size(42, 22);
            this.tfG0.TabIndex = 27;
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(21, 85);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(22, 13);
            this.label9.TabIndex = 26;
            this.label9.Text = "0 =";
            // 
            // tfR0
            // 
            this.tfR0.Font = new System.Drawing.Font("Microsoft Sans Serif", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.tfR0.Location = new System.Drawing.Point(49, 82);
            this.tfR0.Name = "tfR0";
            this.tfR0.Size = new System.Drawing.Size(42, 22);
            this.tfR0.TabIndex = 25;
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(164, 19);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(13, 13);
            this.label5.TabIndex = 24;
            this.label5.Text = "b";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(114, 19);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(13, 13);
            this.label4.TabIndex = 23;
            this.label4.Text = "g";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(66, 19);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(10, 13);
            this.label3.TabIndex = 22;
            this.label3.Text = "r";
            // 
            // tfB1
            // 
            this.tfB1.Font = new System.Drawing.Font("Microsoft Sans Serif", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.tfB1.Location = new System.Drawing.Point(149, 35);
            this.tfB1.Name = "tfB1";
            this.tfB1.Size = new System.Drawing.Size(42, 22);
            this.tfB1.TabIndex = 21;
            // 
            // tfG1
            // 
            this.tfG1.Font = new System.Drawing.Font("Microsoft Sans Serif", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.tfG1.Location = new System.Drawing.Point(99, 35);
            this.tfG1.Name = "tfG1";
            this.tfG1.Size = new System.Drawing.Size(42, 22);
            this.tfG1.TabIndex = 20;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(21, 38);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(22, 13);
            this.label2.TabIndex = 19;
            this.label2.Text = "1 =";
            // 
            // tfR1
            // 
            this.tfR1.Font = new System.Drawing.Font("Microsoft Sans Serif", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.tfR1.Location = new System.Drawing.Point(49, 35);
            this.tfR1.Name = "tfR1";
            this.tfR1.Size = new System.Drawing.Size(42, 22);
            this.tfR1.TabIndex = 18;
            // 
            // button5
            // 
            this.button5.Location = new System.Drawing.Point(398, 19);
            this.button5.Name = "button5";
            this.button5.Size = new System.Drawing.Size(82, 48);
            this.button5.TabIndex = 22;
            this.button5.Text = "взять из файла";
            this.button5.UseVisualStyleBackColor = true;
            this.button5.Click += new System.EventHandler(this.button5_Click);
            // 
            // bViewImplant
            // 
            this.bViewImplant.Location = new System.Drawing.Point(375, 49);
            this.bViewImplant.Name = "bViewImplant";
            this.bViewImplant.Size = new System.Drawing.Size(101, 23);
            this.bViewImplant.TabIndex = 49;
            this.bViewImplant.Text = "отметить";
            this.bViewImplant.UseVisualStyleBackColor = true;
            this.bViewImplant.Click += new System.EventHandler(this.bViewImplant_Click);
            // 
            // labelStatusExtract
            // 
            this.labelStatusExtract.AutoSize = true;
            this.labelStatusExtract.Location = new System.Drawing.Point(388, 152);
            this.labelStatusExtract.Name = "labelStatusExtract";
            this.labelStatusExtract.Size = new System.Drawing.Size(71, 13);
            this.labelStatusExtract.TabIndex = 50;
            this.labelStatusExtract.Text = "status Extract";
            // 
            // Sword
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(881, 525);
            this.Controls.Add(this.labelStatusExtract);
            this.Controls.Add(this.bViewImplant);
            this.Controls.Add(this.groupBox3);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.bExtract);
            this.Controls.Add(this.bImplant);
            this.Name = "Sword";
            this.Text = "Sword (версия  0.2)";
            this.Load += new System.EventHandler(this.Sword_Load);
            this.Shown += new System.EventHandler(this.Sword_Shown);
            this.FormClosed += new System.Windows.Forms.FormClosedEventHandler(this.Sword_FormClosed);
            ((System.ComponentModel.ISupportInitialize)(this.pictureBoxLogoWord)).EndInit();
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.groupBox2.ResumeLayout(false);
            this.groupBox3.ResumeLayout(false);
            this.groupBox4.ResumeLayout(false);
            this.groupBox4.PerformLayout();
            this.groupBox5.ResumeLayout(false);
            this.groupBox5.PerformLayout();
            this.groupBox6.ResumeLayout(false);
            this.groupBox6.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox tfSecretText;
        private System.Windows.Forms.Button bGetFileSecretText;
        private System.Windows.Forms.Button bGetDoc;
        private System.Windows.Forms.PictureBox pictureBoxLogoWord;
        private System.Windows.Forms.Button bImplant;
        private System.Windows.Forms.Button bExtract;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.GroupBox groupBox3;
        private System.Windows.Forms.GroupBox groupBox4;
        private System.Windows.Forms.RadioButton rPrint;
        private System.Windows.Forms.RadioButton rElectro;
        private System.Windows.Forms.Button button6;
        private System.Windows.Forms.GroupBox groupBox5;
        private System.Windows.Forms.RadioButton r16;
        private System.Windows.Forms.GroupBox groupBox6;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.TextBox tfB0;
        private System.Windows.Forms.TextBox tfG0;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.TextBox tfR0;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TextBox tfB1;
        private System.Windows.Forms.TextBox tfG1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox tfR1;
        private System.Windows.Forms.Button button5;
        private System.Windows.Forms.Button bSaveAsDoc;
        private System.Windows.Forms.Button bSaveDoc;
        private System.Windows.Forms.Button bShowDoc;
        private System.Windows.Forms.RadioButton r8;
        private System.Windows.Forms.CheckBox cbArxiv;
        private System.Windows.Forms.RadioButton rCurrentEncoding;
        private System.Windows.Forms.RadioButton rBinText;
        private System.Windows.Forms.RadioButton rOriginalText;
        private System.Windows.Forms.Label labelKeyArxiv;
        private System.Windows.Forms.TextBox tfKeyArxiv;
        private System.Windows.Forms.Button bViewImplant;
        private System.Windows.Forms.Label labelStatusExtract;
    }
}