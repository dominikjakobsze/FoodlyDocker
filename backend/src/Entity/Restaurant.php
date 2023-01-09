<?php

namespace App\Entity;

use App\Repository\RestaurantRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RestaurantRepository::class)]
class Restaurant
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\OneToOne(inversedBy: 'restaurant', cascade: ['persist', 'remove'])]
    private ?UserAuth $userauthtable = null;

    #[ORM\OneToMany(mappedBy: 'restauranttable', targetEntity: Liked::class, cascade: ['persist', 'remove'], fetch: 'LAZY')]
    private Collection $likeds;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $introduction = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $openclose = null;

    #[ORM\OneToMany(mappedBy: 'restauranttable', targetEntity: Menu::class, cascade: ['persist', 'remove'], fetch: 'LAZY')]
    private Collection $menus;

    #[ORM\Column]
    private ?bool $active = null;

    #[ORM\ManyToOne(inversedBy: 'restauranttable')]
    private ?City $city = null;

    #[ORM\ManyToOne(inversedBy: 'restauranttable')]
    private ?Category $category = null;

    #[ORM\OneToMany(mappedBy: 'restauranttable', targetEntity: Comment::class, cascade: ['persist', 'remove'], fetch: 'LAZY')]
    private Collection $index;

    #[ORM\Column(length: 255)]
    private ?string $address = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $imageurl = null;

    public function __construct()
    {
        $this->likeds = new ArrayCollection();
        $this->menus = new ArrayCollection();
        $this->index = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

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
            $liked->setRestauranttable($this);
        }

        return $this;
    }

    public function removeLiked(Liked $liked): self
    {
        if ($this->likeds->removeElement($liked)) {
            // set the owning side to null (unless already changed)
            if ($liked->getRestauranttable() === $this) {
                $liked->setRestauranttable(null);
            }
        }

        return $this;
    }

    public function getIntroduction(): ?string
    {
        return $this->introduction;
    }

    public function setIntroduction(string $introduction): self
    {
        $this->introduction = $introduction;

        return $this;
    }

    public function getOpenclose(): ?string
    {
        return $this->openclose;
    }

    public function setOpenclose(string $openclose): self
    {
        $this->openclose = $openclose;

        return $this;
    }

    /**
     * @return Collection<int, Menu>
     */
    public function getMenus(): Collection
    {
        return $this->menus;
    }

    public function addMenu(Menu $menu): self
    {
        if (!$this->menus->contains($menu)) {
            $this->menus->add($menu);
            $menu->setRestauranttable($this);
        }

        return $this;
    }

    public function removeMenu(Menu $menu): self
    {
        if ($this->menus->removeElement($menu)) {
            // set the owning side to null (unless already changed)
            if ($menu->getRestauranttable() === $this) {
                $menu->setRestauranttable(null);
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

    public function getCity(): ?City
    {
        return $this->city;
    }

    public function setCity(?City $city): self
    {
        $this->city = $city;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): self
    {
        $this->category = $category;

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
            $comment->setRestauranttable($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): self
    {
        if ($this->index->removeElement($comment)) {
            // set the owning side to null (unless already changed)
            if ($comment->getRestauranttable() === $this) {
                $comment->setRestauranttable(null);
            }
        }

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(string $address): self
    {
        $this->address = $address;

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
}
