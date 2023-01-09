<?php

namespace App\Controller;

use App\Entity\UserAuth;
use App\Repository\LikedRepository;
use App\Repository\RestaurantRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class LikedController extends AbstractController
{
    /**
     * @param LikedRepository $liked
     * @return JsonResponse
     */
    public function getMostLikedRestaurants(LikedRepository $liked): JsonResponse
    {
        return $this->json([
            "accepted" => true,
            "result" => $liked->findMostLikedRestaurants()
        ]);
    }

    /**
     * @param LikedRepository $liked
     * @param Request $request
     * @param RestaurantRepository $restaurant
     * @return JsonResponse
     */
    public function add(LikedRepository $liked, Request $request, RestaurantRepository $restaurant): JsonResponse
    {
        $restaurantId = trim($request->request->get('restaurant_id'));
        if ($restaurantId == null) {
            return $this->json([
                "accepted" => false,
                "result" => "Nie podano id restauracji"
            ]);
        }
        $retrievedRestaurant = $restaurant->findBy(['id' => $restaurantId]);
        if (count($retrievedRestaurant) == 0) {
            return $this->json([
                "accepted" => false,
                "result" => "Restauracja o takim id nie istnieje"
            ]);
        }
        $active = $liked->getLikedRestaurantByUser($request->attributes->get('_user')->getId(), $retrievedRestaurant[0]->getId());
        if (count($active) > 0) {
            $liked->changeStatus($active[0]);
        } else {
            $liked->addLiked($retrievedRestaurant[0], $request->attributes->get('_user'));
        }
        return $this->json([
            "accepted" => true,
            "result" => "Dodano do ulubionych"
        ]);
    }

    /**
     * @param LikedRepository $liked
     * @param $id
     * @return JsonResponse
     */
    public function delete(LikedRepository $liked, $id, Request $request): JsonResponse
    {
        $retrievedLiked = $liked->findBy(['id' => $id]);
        if ($request->attributes->get('_user')->getRole() != 'admin') {
            if (count($retrievedLiked) == 0) {
                return $this->json([
                    "accepted" => false,
                    "result" => "Coś poszło nie tak"
                ]);
            }
            if ($retrievedLiked[0]->getUserauthtable()->getId() != $request->attributes->get('_user')->getId()) {
                return $this->json([
                    "accepted" => false,
                    "result" => "Nie masz uprawnień do usunięcia tego rekordu"
                ]);
            }
        }
        $liked->deleteLiked($id, $request->attributes->get('_user'));
        return $this->json([
            "accepted" => true,
            "result" => "Usunięto z ulubionych"
        ]);
    }
}