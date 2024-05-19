using System.Security.Cryptography;
using System;
using System.Text;
using System.Text.Json;
class SchnorrCypher
{
    // Генерация ключей Шнорра
    public static void GenerateSchnorrKeys(out byte[] publicKey, out byte[] privateKey)
    {
        using var schnorr = new ECDsaCng();
        publicKey = schnorr.ExportSubjectPublicKeyInfo();
        privateKey = schnorr.ExportPkcs8PrivateKey();
    }

    // Создание ЭЦП на основе алгоритма Шнорра
    public static byte[] CreateSchnorrSignature(byte[] data, byte[] privateKey)
    {
        using var schnorr = new ECDsaCng();
        schnorr.ImportPkcs8PrivateKey(privateKey, out _);
        return schnorr.SignData(data, HashAlgorithmName.SHA256);
    }

    // Проверка ЭЦП на основе алгоритма Шнорра
    public static bool VerifySchnorrSignature(byte[] data, byte[] signature, byte[] publicKey)
    {
        using var schnorr = new ECDsaCng();
        schnorr.ImportSubjectPublicKeyInfo(publicKey, out _);
        return schnorr.VerifyData(data, signature, HashAlgorithmName.SHA256);
    }
}
class Program
{
    static int Main(string[] args)
    {
        // if (args.Length == 0)
        // {
        //     return -1;
        // }
        string action = args.Length > 0 ? args[0] : "sign";

        var openText = "Qwerty".Select(c => (byte)c).ToArray();
        SchnorrCypher.GenerateSchnorrKeys(out byte[] schnorrPublicKey, out byte[] schnorrPrivateKey);
        var signatureSchnorr = SchnorrCypher.CreateSchnorrSignature(openText, schnorrPrivateKey);
        var schnorrIsValid = SchnorrCypher.VerifySchnorrSignature(openText, signatureSchnorr, schnorrPublicKey);
        
        switch (action)
        {
            case "gen":
            {
                SchnorrCypher.GenerateSchnorrKeys(out byte[] pub, out byte[] prv);
                var publicKey = pub.Select(b => (int)b).ToArray();
                var privateKey = prv.Select(b => (int)b).ToArray();
                Console.Write($"{{\"publicKey\":\"{JsonSerializer.Serialize(publicKey)}\"," + 
                    $"\"privateKey\":\"{JsonSerializer.Serialize(privateKey)}\"}}");
                break;
            }
            case "sign":
            {
                string message = args.Length > 1 ? args[1] : "Qwerty";
                byte[] data = message.Select(c => (byte)c).ToArray();
                string jsonKey = args.Length > 2 ? args[2] : "[48,130,1,6,2,1,0,48,16,6,7,42,134,72,206,61,2,1,6,5,43,129,4,0,35,4,129,223,48,129,220,2,1,1,4,66,0,62,229,215,163,207,234,115,249,247,224,249,17,251,194,41,27,40,112,63,199,1,120,175,74,6,39,71,203,83,24,153,31,39,196,62,70,104,230,28,79,210,144,61,142,206,39,224,2,171,224,194,5,182,133,175,145,166,212,140,105,248,26,147,54,39,160,7,6,5,43,129,4,0,35,161,129,137,3,129,134,0,4,1,59,14,32,96,111,184,248,191,173,177,23,197,20,254,193,222,168,188,142,16,92,76,184,15,109,209,168,147,88,134,167,221,55,77,234,117,200,40,243,236,104,176,41,73,169,70,12,129,171,217,35,158,28,12,86,149,70,46,7,170,8,202,205,110,252,0,114,43,213,97,197,206,109,98,208,72,161,156,134,212,6,118,219,77,221,37,34,10,128,235,143,156,107,234,195,235,178,18,79,89,44,95,222,149,197,110,99,130,213,164,136,186,47,238,201,188,153,238,246,104,252,174,244,51,151,43,171,190,94,3,78,160,13,48,11,6,3,85,29,15,49,4,3,2,0,128]";
                byte[] privateKey = JsonSerializer.Deserialize<int[]>(jsonKey).Select(i => (byte)i).ToArray();
                // var privateKey = schnorrPrivateKey;
                var sign = SchnorrCypher.CreateSchnorrSignature(data, privateKey);
                Console.Write(JsonSerializer.Serialize(sign.Select(b =>(int)b).ToArray()));
                break;
            }
            case "verify":
            {
                string message = args.Length > 1 ? args[1] : "Qwerty";
                byte[] data = message.Select(c => (byte)c).ToArray();
                string strSign = args.Length > 2 ? args[2] : "[0, 96, 3, 211, 237, 78, 251, 179, 32, 2, 147, 51, 26, 156, 203, 160, 100, 226, 178, 42, 30, 61, 93, 211, 18, 21, 44, 84, 72, 146, 187, 137, 215, 173, 78, 60, 160, 162, 188, 92, 226, 232, 248, 59, 13, 183, 55, 19, 120, 60, 167, 6, 29, 26, 93, 161, 234, 160, 140, 36, 114, 219, 147, 92, 15, 109, 0, 34, 190, 173, 138, 239, 160, 23, 228, 23, 204, 73, 26, 77, 130, 235, 189, 120, 198, 191, 118, 60, 223, 187, 23, 114, 2, 198, 29, 209, 18, 26, 128, 2, 213, 174, 70, 32, 88, 249, 155, 191, 60, 242, 52, 121, 215, 47, 99, 61, 23, 120, 224, 35, 13, 31, 152, 26, 90, 117, 151, 171, 14, 55, 143, 234]";
                byte[] sign = strSign.Select(c => (byte)c).ToArray();
                string jsonKey = args.Length > 3 ? args[3] : "[48,129,155,48,16,6,7,42,134,72,206,61,2,1,6,5,43,129,4,0,35,3,129,134,0,4,1,114,215,51,108,115,159,218,30,106,193,235,103,200,67,158,185,182,72,187,211,204,207,252,50,195,218,186,45,75,233,73,126,16,18,248,41,184,48,188,43,38,167,101,169,39,127,243,125,48,181,181,39,87,111,163,153,30,169,38,188,170,228,68,156,136,0,235,115,86,238,110,14,103,205,195,218,60,163,90,9,195,148,229,207,8,27,38,48,129,165,183,141,153,104,137,82,140,126,158,176,47,196,81,0,227,245,219,157,215,160,35,239,65,131,72,233,199,31,146,105,132,35,225,179,249,80,232,3,176,100,188]";
                byte[] publicKey = JsonSerializer.Deserialize<int[]>(jsonKey).Select(i => (byte)i).ToArray();
                bool signIsValid = SchnorrCypher.VerifySchnorrSignature(data, sign, publicKey);
                Console.Write(signIsValid ? 1 : 0);
                break;
            }
        }
        return 0;
    }
}