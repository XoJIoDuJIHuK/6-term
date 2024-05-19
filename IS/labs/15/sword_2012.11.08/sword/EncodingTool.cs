using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Forms;





namespace sword
{
    class EncodingTool
    {
        public RadioButton rb;
        public Encoding encoding;
        public String space;

        public EncodingTool(Encoding encoding, RadioButton rb, String space)
        {
            this.encoding = encoding;
            this.rb = rb;
            this.space = space;
        }
    }
}
