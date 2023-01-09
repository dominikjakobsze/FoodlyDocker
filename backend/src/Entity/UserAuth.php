<?php

namespace App\Entity;

use App\Repository\UserAuthRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserAuthRepository::class)]
class UserAuth
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $email = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $authtoken = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $logincode = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $imageurl = null;

    #[ORM\Column(length: 255)]
    private ?string $role = null;

    #[ORM\OneToOne(mappedBy: 'userauthtable', cascade: ['persist', 'remove'])]
    private ?Restaurant $restaurant = null;

    #[ORM\OneToMany(mappedBy: 'userauthtable', targetEntity: Liked::class, cascade: ['persist', 'remove'], fetch: 'LAZY')]
    private Collection $likeds;

    #[ORM\Column]
    private ?bool $active = null;

    #[ORM\OneToMany(mappedBy: 'userauthtable', targetEntity: Comment::class, cascade: ['persist', 'remove'], fetch: 'LAZY')]
    private Collection $index;

    public function __construct()
    {
        $this->likeds = new ArrayCollection();
        $this->index = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getAuthtoken(): ?string
    {
        return $this->authtoken;
    }

    public function setAuthtoken(?string $authtoken): self
    {
        $this->authtoken = $authtoken;

        return $this;
    }

    public function getLogincode(): ?string
    {
        return $this->logincode;
    }

    public function setLogincode(?string $logincode): self
    {
        $this->logincode = $logincode;

        return $this;
    }

    public function getImageurl(): ?string
    {
        return $this->imageurl;
    }

    public function setImageurl(string $imageurl): self
    {
        $this->imageurl = $imageurl;

        return $this;
    }

    public function getRole(): ?string
    {
        return $this->role;
    }

    public function setRole(string $role): self
    {
        $this->role = $role;

        return $this;
    }

    public function getRestaurant(): ?Restaurant
    {
        return $this->restaurant;
    }

    public function setRestaurant(?Restaurant $restaurant): self
    {
        // unset the owning side of the relation if necessary
        if ($restaurant === null && $this->restaurant !== null) {
            $this->restaurant->setUserauthtable(null);
        }

        // set the owning side of the relation if necessary
        if ($restaurant !== null && $restaurant->getUserauthtable() !== $this) {
            $restaurant->setUserauthtable($this);
        }

        $this->restaurant = $restaurant;

        return $this;
    }

    /**
     * @return Collection<int, Liked>
     */
    public function getLikeds(): Collection
    {
        return $this->likeds;
    }

    public function addLiked(Liked $liked): self
    {
        if (!$this->likeds->contains($liked)) {
            $this->likeds->add($liked);
            $liked->setUserauthtable($this);
        }

        return $this;
    }

    public function removeLiked(Liked $liked): self
    {
        if ($this->likeds->removeElement($liked)) {
            // set the owning side to null (unless already changed)
            if ($liked->getUserauthtable() === $this) {
                $liked->setUserauthtable(null);
            }
        }

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

    /**
     * @return Collection<int, Comment>
     */
    public function getComments(): Collection
    {
        return $this->index;
    }

    public function addComment(Comment $comment): self
    {
        if (!$this->index->contains($comment)) {
            $this->index->add($comment);
            $comment->setUserauthtable($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): self
    {
        if ($this->index->removeElement($comment)) {
            // set the owning side to null (unless already changed)
            if ($comment->getUserauthtable() === $this) {
                $comment->setUserauthtable(null);
            }
        }

        return $this;
    }
}
