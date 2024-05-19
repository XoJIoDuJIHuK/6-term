using System;
using System.Collections.Generic;
using System.Text;

namespace sword
{
    class BY
    {

        public static String getBY(String plainText)
        {
            
            String mes = plainText;
            string word = "";

                List<String> astr = new List<String>();

                int ml = mes.Length;

                for (int i = 0; i < ml; i++) astr.Insert(0, mes.Substring(i, ml - i) + mes.Substring(0, i));

                astr.Sort();
                int N = -1;
                for (int i = 0; i < ml && N == -1; i++) if (astr[i] == mes) N = i;

                word = "";
                for (int i = 0; i < ml; i++) word += astr[i][ml - 1];

                word += "|" + N;

            return word;
        }

        public static String extractBY(String plainText, int num)
        {

            String mes = plainText;
            

            List<String> astr = new List<String>();

            int ml = mes.Length;

            for (int i = 0; i < ml; i++) astr.Insert(0,"");

          //  astr.Sort();
           // int N = -1;
            for (int i = 0; i < ml; i++){
                for (int q = 0; q < ml; q++)
                    astr[q] = mes[q]+astr[q];

                astr.Sort();
            }
            astr.Sort();


            return astr[num];
            
        }

    

    }
}
