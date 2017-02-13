namespace PWClient.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class transactions : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Transactions",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        owner = c.String(),
                        target = c.String(),
                        amount = c.Int(nullable: false),
                        when = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Transactions");
        }
    }
}
