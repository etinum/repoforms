using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data
{
    public class Class1
    {

        public Class1()
        {
            
        }

        public List<RepoForm> GetAllRepoForms()
        {

            var ctx = new PLSFormsDBEntities();

            

            var collection = ctx.RepoForms;

            var list = collection.ToList();

            return list;


        }

    }
}
