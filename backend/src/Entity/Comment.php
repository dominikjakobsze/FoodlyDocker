<?php

namespace App\Entity;

use App\Repository\CommentRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CommentRepository::class)]
class Comment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $content = null;

    #[ORM\ManyToOne(inversedBy: 'index')]
    private ?UserAuth $userauthtable = null;

    #[ORM\ManyToOne(inversedBy: 'index')]
    private ?Restaurant $restauranttable = null;

    #[ORM\Column]
    private ?bool $active = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getUserauthtable(): ?UserAuth
    {
        return $this->userauthtable;
    }

    public function setUserauthtable(?UserAuth $userauthtable): self
    {
        $this->userauthtable = $userauthtable;

        return $this;
    }

    public function getRestauranttable(): ?Restaurant
    {
        return $this->restauranttable;
    }

    public function setRestauranttable(?Restaurant $restauranttable): self
    {
        $this->restauranttable = $restauranttable;

        return $this;
    }

    public function isActive(): ?bool
    {
        return $this->active;
    }

    public function setActive(bool $active): self
    {
        $this->active = $active;

        return $this;
    }
}
