using System;

namespace Program
{
    public class Program
    {
        static void Main(string[] args)
        {
            var file_prefix = @"D:\6-term\IS\labs\14\Lab14\Images\";
            var fileNameOpen = $"{file_prefix}sample.bmp";
            var fileNameEncryptByRows = $"{file_prefix}ecnrypted_by_rows.bmp";
            var fileNameEncryptByColumns = $"{file_prefix}ecnrypted_by_columns.bmp";
            var fileNameMatrixSample = $"{file_prefix}matrix_sample.bmp";
            var fileNameMatrixEncryptByRows = $"{file_prefix}matrix_encrypt_rows.bmp";
            var fileNameMatrixEncryptByColumns = $"{file_prefix}matrix_encrypt_columns.bmp";

            var openTextByRows = "TachylaAlehVyachaslavavich";
            var openTextByColumns = "Tachyla";


            Steganography.HideMessageByRows(fileNameOpen, openTextByRows, fileNameEncryptByRows);
            Steganography.HideMessageByColumns(fileNameOpen, openTextByColumns, fileNameEncryptByColumns);
            var resultByRows = Steganography.ExtractMessageByRows(fileNameEncryptByRows);
            var resultByColumns = Steganography.ExtractMessageByColumns(fileNameEncryptByColumns);
           
            Console.WriteLine($"Text by rows: {resultByRows}");
            Console.WriteLine($"Text by columns: {resultByColumns}");

            Steganography.GetColorMatrix(fileNameOpen, fileNameMatrixSample);
            Steganography.GetColorMatrix(fileNameEncryptByRows, fileNameMatrixEncryptByRows);
            Steganography.GetColorMatrix(fileNameEncryptByColumns, fileNameMatrixEncryptByColumns);
        }
    }
}
