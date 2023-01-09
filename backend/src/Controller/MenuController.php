<?php

namespace App\Controller;

use App\Entity\Menu;
use App\Repository\MenuRepository;
use App\Repository\RestaurantRepository;
use App\Service\FileService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class MenuController extends AbstractController
{
    public function getAllMenuForRestaurant($id, MenuRepository $menu): JsonResponse
    {
        $retrievedMenu = $menu->findByRestaurantId($id);
        if (count($retrievedMenu) == 0) {
            return $this->json([
                "accepted" => true,
                "result" => "Brak menu dla tej restauracji"
            ]);
        }
        return $this->json([
            "accepted" => true,
            "result" => $retrievedMenu
        ]);
    }

    public function newest(MenuRepository $menu)
    {
        $menus = $menu->findNewest();
        return $this->json([
            "accepted" => true,
            "result" => $menus
        ]);
    }

    public function getMenuByUserRestaurant(MenuRepository $menu, Request $request, RestaurantRepository $restaurant)
    {
        $reRestaurant = $restaurant->findBy(["userauthtable" => $request->attributes->get("_user")]);
        if (count($reRestaurant) == 0) {
            return $this->json([
                "accepted" => false,
                "result" => "Brak restauracji dla tego użytkownika"
            ]);
        }
        $retrievedMenu = $menu->findByRestaurantId($reRestaurant[0]->getId());
        if (count($retrievedMenu) == 0) {
            return $this->json([
                "accepted" => false,
                "result" => "Brak menu dla tej restauracji"
            ]);
        }
        return $this->json([
            "accepted" => true,
            "result" => $retrievedMenu
        ]);
    }

    public function add(Request $request, MenuRepository $menuRepository, FileService $file): JsonResponse
    {
        $name = trim($request->request->get('name'));
        $about = trim($request->request->get('about'));
        $image = $request->files->get('image');
        $price = trim($request->request->get('price'));
        if ($name == null || $about == null || $image == null || $price == null) {
            return $this->json([
                "accepted" => false,
                "result" => "Wypełnij wszystkie pola"
            ]);
        }
        if (!is_numeric($price)) {
            return $this->json([
                "accepted" => false,
                "result" => "Cena musi być liczbą"
            ]);
        }
        if ($request->attributes->get('_user')->getRestaurant() == null) {
            return $this->json([
                "accepted" => false,
                "result" => "Nie posiadasz restauracji"
            ]);
        }
        if (!$file->checkIfFileIsImage($image)) {
            return $this->json([
                "accepted" => false,
                "result" => "Niepoprawny format pliku"
            ]);
        }
        $newName = $file->generateNameForFile($image);
        $file->upload($image, $newName, "dishes");
        $dish = new Menu();
        $dish->setName($name);
        $dish->setAbout($about);
        $dish->setPrice($price);
        $dish->setImageurl("/image/dishes/" . $newName);
        $dish->setRestauranttable($request->attributes->get('_user')->getRestaurant());
        $dish->setActive(true);
        $menuRepository->save($dish, true);
        return $this->json([
            "accepted" => true,
            "result" => "Dodano"
        ]);
    }

    public function delete($id, MenuRepository $menuRepository, Request $request): JsonResponse
    {
        $menu = $menuRepository->findOneBy(["id" => $id]);
        if ($menu == null) {
            return $this->json([
                "accepted" => false,
                "result" => "Nie znaleziono"
            ]);
        }
        $menu->setActive(false);
        $menuRepository->save($menu, true);
        return $this->json([
            "accepted" => true,
            "result" => "Usunięto"
        ]);
    }

    public function getOne(Request $request, $id, MenuRepository $menu)
    {
        $menu = $menu->findOneBy(["id" => $id]);
        if ($menu == null) {
            return $this->json([
                "accepted" => false,
                "result" => "Nie znaleziono"
            ]);
        }
        return $this->json([
            "accepted" => true,
            "result" => [
                "id" => $menu->getId(),
                "name" => $menu->getName(),
                "about" => $menu->getAbout(),
                "image" => $menu->getImageurl(),
                "price" => $menu->getPrice()
            ]
        ]);
    }

    public function update(Request $request, $id, MenuRepository $menuRepository, FileService $file)
    {
        $dish = $menuRepository->findOneBy(["id" => $id]);
        if ($dish == null) {
            return $this->json([
                "accepted" => false,
                "result" => "Nie znaleziono"
            ]);
        }
        if ($request->attributes->get("_user")->getRestaurant()->getId() != $dish->getRestauranttable()->getId()) {
            return $this->json([
                "accepted" => false,
                "result" => "Nie posiadasz uprawnień do edycji tego menu"
            ]);
        }
        $name = trim($request->request->get('name'));
        $about = trim($request->request->get('about'));
        $image = $request->files->get('image');
        $price = trim($request->request->get('price'));
        if ($name == null || $about == null || $price == null) {
            return $this->json([
                "accepted" => false,
                "result" => "Wypełnij wszystkie pola"
            ]);
        }
        if (!is_numeric($price)) {
            return $this->json([
                "accepted" => false,
                "result" => "Cena musi być liczbą"
            ]);
        }
        if ($request->attributes->get('_user')->getRestaurant() == null) {
            return $this->json([
                "accepted" => false,
                "result" => "Nie posiadasz restauracji"
            ]);
        }
        if ($image != null) {
            if (!$file->checkIfFileIsImage($image)) {
                return $this->json([
                    "accepted" => false,
                    "result" => "Niepoprawny format pliku"
                ]);
            }
            $newName = $file->generateNameForFile($image);
            $file->upload($image, $newName, "dishes");
            $dish->setImageurl("/image/dishes/" . $newName);
        }
        $dish->setName($name);
        $dish->setAbout($about);
        $dish->setPrice($price);
        $menuRepository->save($dish, true);
        return $this->json([
            "accepted" => true,
            "result" => "Zmieniono"
        ]);
    }

}