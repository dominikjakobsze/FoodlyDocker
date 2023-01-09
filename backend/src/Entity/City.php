<?php

namespace App\Entity;

use App\Repository\CityRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CityRepository::class)]
class City
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $city_name = null;

    #[ORM\OneToMany(mappedBy: 'city', targetEntity: Restaurant::class, cascade: ['persist', 'remove'], fetch: 'LAZY')]
    private Collection $restauranttable;

    #[ORM\Column]
    private ?bool $active = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $imageurl = null;

    public function __construct()
    {
        $this->restauranttable = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCityName(): ?string
    {
        return $this->city_name;
    }

    public function setCityName(string $city_name): self
    {
        $this->city_name = $city_name;

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
            $restauranttable->setCity($this);
        }

        return $this;
    }

    public function removeRestauranttable(Restaurant $restauranttable): self
    {
        if ($this->restauranttable->removeElement($restauranttable)) {
            // set the owning side to null (unless already changed)
            if ($restauranttable->getCity() === $this) {
                $restauranttable->setCity(null);
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
