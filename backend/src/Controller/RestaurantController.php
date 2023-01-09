<?php

namespace App\Controller;

use App\Entity\Restaurant;
use App\Repository\CategoryRepository;
use App\Repository\CityRepository;
use App\Repository\CommentRepository;
use App\Repository\LikedRepository;
use App\Repository\MenuRepository;
use App\Repository\RestaurantRepository;
use App\Service\FileService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

class RestaurantController extends AbstractController
{
    public function getAll(RestaurantRepository $restaurant)
    {
        return $this->json([
            "accepted" => true,
            "result" => $restaurant->findAllRestaurants()
        ]);
    }

    public function getOne(RestaurantRepository $restaurant, CommentRepository $comment, LikedRepository $liked, MenuRepository $menu, $id)
    {
        $retrievedRestaurant = $restaurant->findOneById($id);
        if (count($retrievedRestaurant) > 0) {
            $allComments = $comment->getAllCommentsByRestaurant($retrievedRestaurant[0]['id']);
            $allLikes = $liked->getAllLikesByRestaurant($retrievedRestaurant[0]['id']);
            $allMenus = $menu->getAllMenusByRestaurant($retrievedRestaurant[0]['id']);
            return $this->json([
                "accepted" => true,
                "result" => [
                    "restaurant" => $retrievedRestaurant,
                    "comments" => $allComments,
                    "likes" => $allLikes,
                    "menus" => $allMenus
                ]
            ]);
        } else {
            return $this->json([
                "accepted" => false,
                "result" => "Nie istnieje taka restauracja"
            ]);
        }
    }

    public function restaurantByToken(Request $request, RestaurantRepository $restaurant)
    {
        return $this->json([
            'accepted' => true,
            'result' => $restaurant->findOneByToken($request->attributes->get('_user')->getId())
        ]);
    }

    public function add(Request $request, RestaurantRepository $repository, FileService $file, CityRepository $city, CategoryRepository $category)
    {
        if ($repository->findBy(['userauthtable' => $request->attributes->get('_user')->getId()])) {
            return $this->json([
                'accepted' => false,
                'result' => 'Restauracja już istnieje'
            ]);
        }
        $name = trim($request->request->get('name'));
        $introduction = trim($request->request->get('introduction'));
        $address = trim($request->request->get('address'));
        $openclose = trim($request->request->get('openclose'));
        $cityId = trim($request->request->get('city'));
        $categoryId = trim($request->request->get('category'));
        $image = $request->files->get('image');
        if ($name == null || $introduction == null || $address == null || $openclose == null || $image == null || $cityId == null || $categoryId == null) {
            return $this->json([
                'accepted' => false,
                'result' => 'Wszystkie pola muszą być wypełnione'
            ]);
        }
        if (!$file->checkIfFileIsImage($image)) {
            return $this->json([
                'accepted' => false,
                'result' => 'Plik musi być zdjęciem'
            ]);
        }
        $newFileName = $file->generateNameForFile($image);
        $file->upload($image, $newFileName, "restaurants");
        $restaurant = new Restaurant();
        $restaurant->setActive(true);
        $restaurant->setUserauthtable($request->attributes->get('_user'));
        $restaurant->setImageurl("/image/restaurants/" . $newFileName);
        $restaurant->setName($name);
        $restaurant->setIntroduction($introduction);
        $restaurant->setAddress($address);
        $restaurant->setOpenclose($openclose);
        $restaurant->setCategory($category->findBy(['id' => $categoryId])[0]);
        $restaurant->setCity($city->findBy(['id' => $cityId])[0]);
        $repository->save($restaurant, true);
        return $this->json([
            'accepted' => true,
            'result' => true
        ]);
    }

    public function update(Request $request, RestaurantRepository $repository, FileService $file, CityRepository $city, CategoryRepository $category)
    {
        if (!$repository->findBy(['userauthtable' => $request->attributes->get('_user')->getId()])) {
            return $this->json([
                'accepted' => false,
                'result' => 'Musisz na początku dodać restaurację, żeby móc ją edytować'
            ]);
        }
        $name = trim($request->request->get('name'));
        $introduction = trim($request->request->get('introduction'));
        $address = trim($request->request->get('address'));
        $openclose = trim($request->request->get('openclose'));
        $cityId = trim($request->request->get('city'));
        $categoryId = trim($request->request->get('category'));
        $image = $request->files->get('image');
        if ($name == null || $introduction == null || $address == null || $openclose == null) {
            return $this->json([
                'accepted' => false,
                'result' => 'Wszystkie pola muszą być wypełnione'
            ]);
        }
        $restaurant = $repository->findBy(['userauthtable' => $request->attributes->get('_user')->getId()])[0];
        if ($image != null) {
            if (!$file->checkIfFileIsImage($image)) {
                return $this->json([
                    'accepted' => false,
                    'result' => 'Plik musi być zdjęciem'
                ]);
            }
            $newFileName = $file->generateNameForFile($image);
            $file->upload($image, $newFileName, "restaurants");
            $restaurant->setImageurl("/image/restaurants/" . $newFileName);
        }
        if ($cityId != null) {
            $restaurant->setCity($city->findBy(['id' => $cityId])[0]);
        }
        if ($categoryId != null) {
            $restaurant->setCategory($category->findBy(['id' => $categoryId])[0]);
        }
        $restaurant->setName($name);
        $restaurant->setIntroduction($introduction);
        $restaurant->setAddress($address);
        $restaurant->setOpenclose($openclose);
        $repository->save($restaurant, true);
        return $this->json([
            'accepted' => true,
            'result' => true
        ]);
    }
}