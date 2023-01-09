<?php

namespace App\Entity;

use App\Repository\CategoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CategoryRepository::class)]
class Category
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $category_name = null;

    #[ORM\OneToMany(mappedBy: 'category', targetEntity: Restaurant::class, cascade: ['persist', 'remove'], fetch: 'LAZY')]
    private Collection $restauranttable;

    #[ORM\Column]
    private ?bool $active = null;

    public function __construct()
    {
        $this->restauranttable = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCategoryName(): ?string
    {
        return $this->category_name;
    }

    public function setCategoryName(string $category_name): self
    {
        $this->category_name = $category_name;

        return $this;
    }

    /**
     * @return Collection<int, Restaurant>
     */
    public function getRestauranttable(): Collection
    {
        return $this->restauranttable;
    }

    public function addRestauranttable(Restaurant $restauranttable): self
    {
        if (!$this->restauranttable->contains($restauranttable)) {
            $this->restauranttable->add($restauranttable);
            $restauranttable->setCategory($this);
        }

        return $this;
    }

    public function removeRestauranttable(Restaurant $restauranttable): self
    {
        if ($this->restauranttable->removeElement($restauranttable)) {
            // set the owning side to null (unless already changed)
            if ($restauranttable->getCategory() === $this) {
                $restauranttable->setCategory(null);
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
}
