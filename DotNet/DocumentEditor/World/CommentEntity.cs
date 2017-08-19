using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DocumentEditor.World
{
    public class CommentEntity
    {
        public CommentEntity()
        {
            ChildId = -1;
            ChileNode = new List<CommentEntity>();
        }
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ChildId { get; set; }
        public string Author { get; set; }
        public string HtmlExpress { get; set; }
        public string Text { get; set; }
        public string DateTime { get; set; }
        public string UserImg { get; set; }
        public List<CommentEntity> ChileNode { get; set; }
    }
}
