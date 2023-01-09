<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230106134747 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE comment (id INT AUTO_INCREMENT NOT NULL, userauthtable_id INT DEFAULT NULL, restauranttable_id INT DEFAULT NULL, content LONGTEXT NOT NULL, INDEX IDX_9474526C213592B9 (userauthtable_id), INDEX IDX_9474526C52FC9554 (restauranttable_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526C213592B9 FOREIGN KEY (userauthtable_id) REFERENCES user_auth (id)');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526C52FC9554 FOREIGN KEY (restauranttable_id) REFERENCES restaurant (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE comment DROP FOREIGN KEY FK_9474526C213592B9');
        $this->addSql('ALTER TABLE comment DROP FOREIGN KEY FK_9474526C52FC9554');
        $this->addSql('DROP TABLE comment');
    }
}
