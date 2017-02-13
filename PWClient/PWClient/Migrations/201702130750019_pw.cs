namespace PWClient.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class pw : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "PW", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "PW");
        }
    }
}
