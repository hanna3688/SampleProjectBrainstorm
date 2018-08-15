using Microsoft.EntityFrameworkCore.Migrations;

namespace MyBlogSite.Migrations
{
    public partial class renew : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BrainstormBoards_Users_AuthorId",
                table: "BrainstormBoards");

            migrationBuilder.DropForeignKey(
                name: "FK_StickyNotes_BrainstormBoards_BoardId",
                table: "StickyNotes");

            migrationBuilder.DropIndex(
                name: "IX_StickyNotes_BoardId",
                table: "StickyNotes");

            migrationBuilder.DropIndex(
                name: "IX_BrainstormBoards_AuthorId",
                table: "BrainstormBoards");

            migrationBuilder.AddColumn<int>(
                name: "BrainstormBoardId",
                table: "StickyNotes",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AuthorId",
                table: "BrainstormBoards",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "BrainstormBoards",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_StickyNotes_BrainstormBoardId",
                table: "StickyNotes",
                column: "BrainstormBoardId");

            migrationBuilder.CreateIndex(
                name: "IX_BrainstormBoards_UserId",
                table: "BrainstormBoards",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_BrainstormBoards_Users_UserId",
                table: "BrainstormBoards",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StickyNotes_BrainstormBoards_BrainstormBoardId",
                table: "StickyNotes",
                column: "BrainstormBoardId",
                principalTable: "BrainstormBoards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BrainstormBoards_Users_UserId",
                table: "BrainstormBoards");

            migrationBuilder.DropForeignKey(
                name: "FK_StickyNotes_BrainstormBoards_BrainstormBoardId",
                table: "StickyNotes");

            migrationBuilder.DropIndex(
                name: "IX_StickyNotes_BrainstormBoardId",
                table: "StickyNotes");

            migrationBuilder.DropIndex(
                name: "IX_BrainstormBoards_UserId",
                table: "BrainstormBoards");

            migrationBuilder.DropColumn(
                name: "BrainstormBoardId",
                table: "StickyNotes");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "BrainstormBoards");

            migrationBuilder.AlterColumn<string>(
                name: "AuthorId",
                table: "BrainstormBoards",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_StickyNotes_BoardId",
                table: "StickyNotes",
                column: "BoardId");

            migrationBuilder.CreateIndex(
                name: "IX_BrainstormBoards_AuthorId",
                table: "BrainstormBoards",
                column: "AuthorId");

            migrationBuilder.AddForeignKey(
                name: "FK_BrainstormBoards_Users_AuthorId",
                table: "BrainstormBoards",
                column: "AuthorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StickyNotes_BrainstormBoards_BoardId",
                table: "StickyNotes",
                column: "BoardId",
                principalTable: "BrainstormBoards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
