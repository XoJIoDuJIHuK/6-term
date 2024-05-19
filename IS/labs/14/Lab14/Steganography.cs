using System;
using System.Collections;
using System.Drawing;
using System.Drawing.Imaging;
using System.Text;


namespace Program
{
    public class Steganography
    {
        public static void HideMessageByRows(string containerPath, string message, string outputImagePath)
        {
            Bitmap container = new(containerPath);

            byte[] messageBytes = Encoding.UTF8.GetBytes(message);
            BitArray messageBits = new(messageBytes);

            int maxMessageBits = (container.Width * container.Height) * 3;
            if (messageBits.Length > maxMessageBits)
                throw new Exception("Сообщение слишком большое для данного контейнера");

            int messageBitIndex = 0;
            for (int y = 0; y < container.Height; y++)
            {
                for (int x = 0; x < container.Width; x++)
                {
                    Color pixel = container.GetPixel(x, y);
                    if (messageBitIndex < messageBits.Length)
                    {
                        BitArray redBits = new(new byte[] { pixel.R });
                        BitArray greenBits = new(new byte[] { pixel.G });
                        BitArray blueBits = new(new byte[] { pixel.B });

                        if (messageBits[messageBitIndex])
                            redBits[0] = true;
                        else
                            redBits[0] = false;

                        messageBitIndex++;

                        if (messageBitIndex < messageBits.Length)
                        {
                            if (messageBits[messageBitIndex])
                                greenBits[0] = true;
                            else
                                greenBits[0] = false;

                            messageBitIndex++;
                        }

                        if (messageBitIndex < messageBits.Length)
                        {
                            if (messageBits[messageBitIndex])
                                blueBits[0] = true;
                            else
                                blueBits[0] = false;

                            messageBitIndex++;
                        }

                        byte[] newRedBytes = new byte[1];
                        byte[] newGreenBytes = new byte[1];
                        byte[] newBlueBytes = new byte[1];
                        redBits.CopyTo(newRedBytes, 0);
                        greenBits.CopyTo(newGreenBytes, 0);
                        blueBits.CopyTo(newBlueBytes, 0);
                        Color newPixel = Color.FromArgb(newRedBytes[0], newGreenBytes[0], newBlueBytes[0]);

                        container.SetPixel(x, y, newPixel);
                    }
                    else
                        break;
                }

                if (messageBitIndex >= messageBits.Length)
                    break;
            }

            container.Save(outputImagePath, ImageFormat.Png);
        }




        public static string ExtractMessageByRows(string imagePath)
        {
            Bitmap container = new(imagePath);

            int messageBitsLength = (container.Width * container.Height) * 3;
            BitArray messageBits = new(messageBitsLength);

            int messageBitIndex = 0;
            for (int y = 0; y < container.Height; y++)
            {
                for (int x = 0; x < container.Width; x++)
                {
                    Color pixel = container.GetPixel(x, y);
                    BitArray redBits = new(new byte[] { pixel.R });
                    BitArray greenBits = new(new byte[] { pixel.G });
                    BitArray blueBits = new(new byte[] { pixel.B });

                    bool redBit = redBits[0];
                    messageBits[messageBitIndex] = redBit;
                    messageBitIndex++;

                    if (messageBitIndex < messageBitsLength)
                    {
                        bool greenBit = greenBits[0];
                        messageBits[messageBitIndex] = greenBit;
                        messageBitIndex++;
                    }

                    if (messageBitIndex < messageBitsLength)
                    {
                        bool blueBit = blueBits[0];
                        messageBits[messageBitIndex] = blueBit;
                        messageBitIndex++;
                    }

                    if (messageBitIndex >= messageBitsLength)
                        break;
                }

                if (messageBitIndex >= messageBitsLength)
                    break;
            }

            byte[] messageBytes = new byte[(messageBits.Length + 7) / 8];
            messageBits.CopyTo(messageBytes, 0);
            string message = Encoding.UTF8.GetString(messageBytes);

            var sb = new StringBuilder("");
            foreach (var ch in message)
            {
                if (ch > 255)
                    break;
                sb.Append(ch);
            }

            return sb.ToString();
        }




        public static void HideMessageByColumns(string containerPath, string message, string outputImagePath)
        {
            Bitmap container = new(containerPath);

            byte[] messageBytes = Encoding.UTF8.GetBytes(message);
            BitArray messageBits = new(messageBytes);

            int maxMessageBits = (container.Width * container.Height) * 3;
            if (messageBits.Length > maxMessageBits)
                throw new Exception("Сообщение слишком большое для данного контейнера");

            int messageBitIndex = 0;
            for (int y = 0; y < container.Width; y++)
            {
                for (int x = 0; x < container.Height; x++)
                {
                    Color pixel = container.GetPixel(x, y);
                    if (messageBitIndex < messageBits.Length)
                    {
                        BitArray redBits = new(new byte[] { pixel.R });
                        BitArray greenBits = new(new byte[] { pixel.G });
                        BitArray blueBits = new(new byte[] { pixel.B });

                        if (messageBits[messageBitIndex])
                            redBits[0] = true;
                        else
                            redBits[0] = false;

                        messageBitIndex++;

                        if (messageBitIndex < messageBits.Length)
                        {
                            if (messageBits[messageBitIndex])
                                greenBits[0] = true;
                            else
                                greenBits[0] = false;

                            messageBitIndex++;
                        }

                        if (messageBitIndex < messageBits.Length)
                        {
                            if (messageBits[messageBitIndex])
                                blueBits[0] = true;
                            else
                                blueBits[0] = false;

                            messageBitIndex++;
                        }

                        byte[] newRedBytes = new byte[1];
                        byte[] newGreenBytes = new byte[1];
                        byte[] newBlueBytes = new byte[1];
                        redBits.CopyTo(newRedBytes, 0);
                        greenBits.CopyTo(newGreenBytes, 0);
                        blueBits.CopyTo(newBlueBytes, 0);
                        Color newPixel = Color.FromArgb(newRedBytes[0], newGreenBytes[0], newBlueBytes[0]);

                        container.SetPixel(y, x, newPixel);
                    }
                    else
                        break;
                }

                if (messageBitIndex >= messageBits.Length)
                    break;
            }

            container.Save(outputImagePath, ImageFormat.Png);
        }



        public static string ExtractMessageByColumns(string imagePath)
        {
            Bitmap container = new(imagePath);
            int messageBitsLength = (container.Width * container.Height) * 3;
            BitArray messageBits = new(messageBitsLength);

            int messageBitIndex = 0;
            for (int y = 0; y < container.Width; y++)
            {
                for (int x = 0; x < container.Height; x++)
                {
                    Color pixel = container.GetPixel(y, x);
                    BitArray redBits = new(new byte[] { pixel.R });
                    BitArray greenBits = new(new byte[] { pixel.G });
                    BitArray blueBits = new(new byte[] { pixel.B });

                    bool redBit = redBits[0];
                    messageBits[messageBitIndex] = redBit;
                    messageBitIndex++;

                    if (messageBitIndex < messageBitsLength)
                    {
                        bool greenBit = greenBits[0];
                        messageBits[messageBitIndex] = greenBit;
                        messageBitIndex++;
                    }

                    if (messageBitIndex < messageBitsLength)
                    {
                        bool blueBit = blueBits[0];
                        messageBits[messageBitIndex] = blueBit;
                        messageBitIndex++;
                    }

                    if (messageBitIndex >= messageBitsLength)
                        break;
                }

                if (messageBitIndex >= messageBitsLength)
                    break;
            }

            byte[] messageBytes = new byte[(messageBits.Length + 7) / 8];
            messageBits.CopyTo(messageBytes, 0);
            string message = Encoding.UTF8.GetString(messageBytes);

            var sb = new StringBuilder("");
            foreach (var ch in message)
            {
                if (ch > 255)
                    break;
                sb.Append(ch);
            }

            return sb.ToString();
        }






        public static void GetColorMatrix(string imagePath, string outputPath)
        {
            Bitmap originalImage = new(imagePath);
            Bitmap newImage = new(originalImage.Width, originalImage.Height);

            for (int y = 0; y < originalImage.Height; y++)
            {
                for (int x = 0; x < originalImage.Width; x++)
                {
                    Color pixel = originalImage.GetPixel(x, y);

                    byte red = (byte)(pixel.R & 0x01);
                    byte green = (byte)(pixel.G & 0x01);
                    byte blue = (byte)(pixel.B & 0x01);

                    Color newPixel = Color.FromArgb(red * 255, green * 255, blue * 255);
                    newImage.SetPixel(x, y, newPixel);
                }
            }

            newImage.Save(outputPath, ImageFormat.Png);
        }
    }
}
