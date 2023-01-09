<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230106131623 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE liked ADD active TINYINT(1) NOT NULL');
        $this->addSql('ALTER TABLE menu ADD active TINYINT(1) NOT NULL');
        $this->addSql('ALTER TABLE restaurant ADD active TINYINT(1) NOT NULL');
        $this->addSql('ALTER TABLE user_auth ADD active TINYINT(1) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE liked DROP active');
        $this->addSql('ALTER TABLE user_auth DROP active');
        $this->addSql('ALTER TABLE menu DROP active');
        $this->addSql('ALTER TABLE restaurant DROP active');
    }
}
