<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\City;
use App\Entity\Comment;
use App\Entity\Liked;
use App\Entity\Menu;
use App\Entity\Restaurant;
use App\Entity\UserAuth;
use Doctrine\Persistence\ManagerRegistry;
use Faker\Factory;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

class SeederController extends AbstractController
{
    public function seeder(ManagerRegistry $doctrine): JsonResponse
    {
        //init data
        $cityImg = ['c1.jpg', 'c2.jpg', 'c3.jpg', 'c4.jpg', 'c5.jpg', 'c6.jpg'];
        $restaurantImg = ['r1.jpg', 'r2.jpg', 'r3.jpg', 'r4.jpg', 'r5.jpg', 'r6.jpg', 'r7.jpg', 'r8.jpg', 'r9.jpg', 'r10.jpg'];
        $dishImg = ['d1.jpg', 'd2.jpg', 'd3.jpg', 'd4.jpg', 'd5.jpg', 'd6.jpg', 'd7.jpg', 'd8.jpg', 'd9.jpg', 'd10.jpg', 'd11.jpg', 'd12.jpg', 'd13.jpg', 'd14.jpg', 'd15.jpg'];
        //faker instance
        $faker = Factory::create();
        //if city table is empty
        $cityTableHasData = $doctrine->getRepository(City::class)->findAll();
        if (count($cityTableHasData) <= 0) {
            $cityData = ["Poznań", "Warszawa", "Gdańsk", "Łódź", "Katowice", "Kraków", "Sopot", "Wrocław", "Gdynia", "Szczecin"];
            for ($i = 0; $i < count($cityData); $i++) {
                $city = new City();
                $city->setCityName($faker->unique()->randomElement($cityData));
                $city->setActive(true);
                $city->setImageurl("/image/cities/" . $faker->randomElement($cityImg));
                $doctrine->getManager()->persist($city);
            }
            $doctrine->getManager()->flush();
        }
        $cityTableHasData = null;
        //if category table is empty
        $categoryTableHasData = $doctrine->getRepository(Category::class)->findAll();
        if (count($categoryTableHasData) <= 0) {
            $categoryData = ["Standard", "Premium", "FastFood", "Family", 'Bar', "Pub", "Cafe"];
            for ($i = 0; $i < count($categoryData); $i++) {
                $category = new Category();
                $category->setCategoryName($faker->unique()->randomElement($categoryData));
                $category->setActive(true);
                $doctrine->getManager()->persist($category);
            }
        }
        $categoryTableHasData = null;
        //if user auth table is empty
        $userAuthTableHasData = $doctrine->getManager()->getRepository(UserAuth::class)->findAll();
        if (count($userAuthTableHasData) <= 0) {
            for ($i = 0; $i < 100; $i++) {
                $randomNumber = $faker->numberBetween(0, 100);
                $role = $randomNumber < 94 ? 'user' : 'owner';
                $user = new UserAuth();
                $user->setEmail($faker->unique()->email());
                $user->setImageurl("/image/avatars/avatar.png");
                $user->setRole($role);
                $user->setActive(true);
                $doctrine->getManager()->persist($user);
            }
            $doctrine->getManager()->flush();
        }
        $userAuthTableHasData = null;
        //if restaurant table is empty
        $userTypeOwner = $doctrine->getManager()->getRepository(UserAuth::class)->findBy(['role' => 'owner']);
        $restaurantTableHasData = $doctrine->getManager()->getRepository(Restaurant::class)->findAll();
        if (count($restaurantTableHasData) <= 0) {
            $getAllCities = $doctrine->getManager()->getRepository(City::class)->findAll();
            $getAllCategories = $doctrine->getManager()->getRepository(Category::class)->findAll();
            foreach ($userTypeOwner as $owner) {
                $restaurant = new Restaurant();
                $restaurant->setName($faker->unique()->company());
                $restaurant->setUserauthtable($owner);
                $restaurant->setAddress($faker->words(3, true));
                $restaurant->setCity($faker->randomElement($getAllCities));
                $restaurant->setIntroduction($faker->text(700));
                $restaurant->setOpenclose("pn-pt: 10:00 - 22:00; sb-nd: nieczynne");
                $restaurant->setCategory($faker->randomElement($getAllCategories));
                $restaurant->setImageurl("/image/restaurants/" . $faker->randomElement($restaurantImg));
                $restaurant->setActive(true);
                $doctrine->getManager()->persist($restaurant);
            }
            $doctrine->getManager()->flush();
        }
        $userTypeOwner = null;
        $restaurantTableHasData = null;
        //if liked table is empty
        $likedTableHasData = $doctrine->getManager()->getRepository(Liked::class)->findAll();
        if (count($likedTableHasData) <= 0) {
            $getAllUsers = $doctrine->getManager()->getRepository(UserAuth::class)->findAll();
            $getAllRestaurants = $doctrine->getManager()->getRepository(Restaurant::class)->findAll();
            for ($i = 0; $i < 700; $i++) {
                $liked = new Liked();
                $liked->setRestauranttable($getAllRestaurants[$faker->numberBetween(0, count($getAllRestaurants) - 1)]);
                $liked->setUserauthtable($getAllUsers[$faker->numberBetween(0, count($getAllUsers) - 1)]);
                $liked->setActive(true);
                $doctrine->getManager()->persist($liked);
            }
            $doctrine->getManager()->flush();
        }
        $likedTableHasData = null;
        //if menu table is empty
        $menuTableHasData = $doctrine->getManager()->getRepository(Menu::class)->findAll();
        if (count($menuTableHasData) <= 0) {
            $getAllRestaurants = $doctrine->getManager()->getRepository(Restaurant::class)->findAll();
            for ($i = 0; $i < 80; $i++) {
                $menu = new Menu();
                $menu->setRestauranttable($getAllRestaurants[$faker->numberBetween(0, count($getAllRestaurants) - 1)]);
                $menu->setName($faker->unique()->word());
                $menu->setAbout($faker->text(250));
                $menu->setPrice($faker->numberBetween(15, 100));
                $menu->setActive(true);
                $menu->setImageurl("/image/dishes/" . $faker->randomElement($dishImg));
                $doctrine->getManager()->persist($menu);
            }
            $doctrine->getManager()->flush();
        }
        $menuTableHasData = null;
        //if comment table is empty
        $commentTableHasData = $doctrine->getRepository(Comment::class)->findAll();
        if (count($commentTableHasData) <= 0) {
            $getAllUsers = $doctrine->getManager()->getRepository(UserAuth::class)->findAll();
            $getAllRestaurants = $doctrine->getManager()->getRepository(Restaurant::class)->findAll();
            for ($i = 0; $i < 110; $i++) {
                $comment = new Comment();
                $comment->setContent($faker->text(120));
                $comment->setUserauthtable($faker->randomElement($getAllUsers));
                $comment->setRestauranttable($faker->randomElement($getAllRestaurants));
                $comment->setActive(true);
                $doctrine->getManager()->persist($comment);
            }
            $doctrine->getManager()->flush();
        }
        $commentTableHasData = null;
        $user = new UserAuth();
        $user->setEmail("user@gmail.com");
        $user->setImageurl("/image/avatars/avatar.png");
        $user->setActive(true);
        $user->setRole("user");
        $user->setAuthtoken("user");
        $doctrine->getManager()->persist($user);
        $admin = new UserAuth();
        $admin->setEmail("admin@gmail.com");
        $admin->setImageurl("/image/avatars/avatar.png");
        $admin->setActive(true);
        $admin->setRole("admin");
        $admin->setAuthtoken("admin");
        $doctrine->getManager()->persist($admin);
        $owner = new UserAuth();
        $owner->setEmail("owner@gmail.com");
        $owner->setImageurl("/image/avatars/avatar.png");
        $owner->setActive(true);
        $owner->setRole("owner");
        $owner->setAuthtoken("owner");
        $doctrine->getManager()->persist($owner);
        $doctrine->getManager()->flush();
        return $this->json(["status" => "db migrated"]);
    }

    public function cleanup(ManagerRegistry $doctrine): JsonResponse
    {
        //clear all data from user_auth table
        $allUsers = $doctrine->getManager()->getRepository(UserAuth::class)->findAll();
        foreach ($allUsers as $user) {
            $doctrine->getManager()->remove($user);
        }
        $doctrine->getManager()->flush();
        //clear all data from restaurant table
        $allRestaurants = $doctrine->getManager()->getRepository(Restaurant::class)->findAll();
        foreach ($allRestaurants as $restaurant) {
            $doctrine->getManager()->remove($restaurant);
        }
        $doctrine->getManager()->flush();
        //clear all data from liked table
        $allLiked = $doctrine->getManager()->getRepository(Liked::class)->findAll();
        foreach ($allLiked as $liked) {
            $doctrine->getManager()->remove($liked);
        }
        //clear all data from menu table
        $allMenu = $doctrine->getManager()->getRepository(Menu::class)->findAll();
        foreach ($allMenu as $menu) {
            $doctrine->getManager()->remove($menu);
        }
        //clear all data from comment table
        $allComment = $doctrine->getManager()->getRepository(Comment::class)->findAll();
        foreach ($allComment as $comment) {
            $doctrine->getManager()->remove($comment);
        }
        //clear all data from city table
        $allCity = $doctrine->getManager()->getRepository(City::class)->findAll();
        foreach ($allCity as $city) {
            $doctrine->getManager()->remove($city);
        }
        //clear all data from category table
        $allCategory = $doctrine->getManager()->getRepository(Category::class)->findAll();
        foreach ($allCategory as $category) {
            $doctrine->getManager()->remove($category);
        }
        $doctrine->getManager()->flush();
        return $this->json(["status" => "db cleanup"]);
    }
}