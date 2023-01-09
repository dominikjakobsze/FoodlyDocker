<?php

namespace App\Controller;

use App\Entity\UserAuth;
use App\Repository\CommentRepository;
use App\Repository\RestaurantRepository;
use App\Repository\UserAuthRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class CommentController extends AbstractController
{
    public function getOne(CommentRepository $comment, $id)
    {
        $comment = $comment->findBy(['id' => $id]);
        if (count($comment) == 0) {
            return $this->json([
                'accepted' => false,
                'result' => "Nie istnieje komentarz o podanym id"
            ]);
        }
        return $this->json([
            'accepted' => true,
            'result' => [
                "id" => $comment[0]->getId(),
                "content" => $comment[0]->getContent(),
            ]
        ]);
    }

    /**
     * @param $restaurantId
     * @param CommentRepository $comment
     * @param RestaurantRepository $restaurant
     * @return JsonResponse
     */
    public function getAllCommentsByRestaurant($restaurantId, CommentRepository $comment, RestaurantRepository $restaurant): JsonResponse
    {
        $retrievedRestaurant = $restaurant->findBy(['id' => $restaurantId]);
        if (count($retrievedRestaurant) == 0) {
            return $this->json([
                "accepted" => false,
                "result" => "Restauracja o takim id nie istnieje"
            ]);
        }
        $retrievedComments = $comment->getAllCommentsByRestaurant($restaurantId);
        if (count($retrievedComments) == 0) {
            return $this->json([
                "accepted" => true,
                "result" => "Restauracja nie posiada jeszcze żadnych komentarzy"
            ]);
        }
        return $this->json([
            "accepted" => true,
            "result" => $retrievedComments
        ]);
    }

    /**
     * @param UserAuthRepository $user
     * @param CommentRepository $comment
     * @return JsonResponse
     */
    public function getAllCommentsByUser(UserAuthRepository $user, CommentRepository $comment, Request $request): JsonResponse
    {
        $retrievedUser = $user->findBy(['id' => $request->attributes->get('_user')->getId()]);
        if (count($retrievedUser) == 0) {
            return $this->json([
                "accepted" => false,
                "result" => "Użytkownik o takim id nie istnieje"
            ]);
        }
        $retrievedComments = $comment->getAllCommentsByUser($retrievedUser[0]->getId());
        if (count($retrievedComments) == 0) {
            return $this->json([
                "accepted" => true,
                "result" => "Użytkownik nie posiada jeszcze żadnych komentarzy"
            ]);
        }
        return $this->json([
            "accepted" => true,
            "result" => $retrievedComments
        ]);
    }

    /**
     * @param Request $request
     * @param CommentRepository $comment
     * @param RestaurantRepository $restaurant
     * @return JsonResponse
     */
    public function add(Request $request, CommentRepository $comment, RestaurantRepository $restaurant): JsonResponse
    {
        $content = trim($request->request->get('content'));
        $restaurantId = trim($request->request->get('restaurant_id'));
        if ($content == null || $restaurantId == null) {
            return $this->json([
                "accepted" => false,
                "result" => "Id restauracji i treść komentarza nie mogą być puste"
            ]);
        }
        $retrievedRestaurant = $restaurant->findBy(['id' => $restaurantId]);
        if (count($retrievedRestaurant) == 0) {
            return $this->json([
                "accepted" => false,
                "result" => "Restauracja o takiej Id nie istnieje"
            ]);
        }
        $comment->addComment($retrievedRestaurant[0], $content, $request->attributes->get('_user'));
        return $this->json([
            "accepted" => true,
            "result" => "Dodano komentarz"
        ]);
    }

    /**
     * @param Request $request
     * @param $id
     * @param CommentRepository $comment
     * @return JsonResponse
     */
    public function update(Request $request, $id, CommentRepository $comment): JsonResponse
    {
        if ($request->attributes->get('_user')->getRole() != 'admin') {
            $retrievedComment = $comment->findBy(['id' => $id]);
            if (count($retrievedComment) == 0) {
                return $this->json([
                    "accepted" => false,
                    "result" => "Komentarz o takim id nie istnieje"
                ]);
            }
            if ($retrievedComment[0]->getUserauthtable()->getId() != $request->attributes->get('_user')->getId()) {
                return $this->json([
                    "accepted" => false,
                    "result" => "Nie masz uprawnień do edycji tego komentarza"
                ]);
            }
        }
        $content = trim($request->request->get('content'));
        if ($content == null) {
            return $this->json([
                "accepted" => false,
                "result" => "Treść komentarza nie może być pusta"
            ]);
        }
        $retrievedComment = $comment->findBy(['id' => $id]);
        $comment->updateComment($retrievedComment[0], $content);
        return $this->json([
            "accepted" => true,
            "result" => "Zaktualizowano komentarz"
        ]);
    }

    /**
     * @param $id
     * @param CommentRepository $comment
     * @param Request $request
     * @return JsonResponse
     */
    public function delete($id, CommentRepository $comment, Request $request): JsonResponse
    {
        if ($request->attributes->get('_user')->getRole() != 'admin') {
            $retrievedComment = $comment->findBy(['id' => $id]);
            if (count($retrievedComment) == 0) {
                return $this->json([
                    "accepted" => false,
                    "result" => "Komentarz o takim id nie istnieje"
                ]);
            }
            if ($retrievedComment[0]->getUserauthtable()->getId() != $request->attributes->get('_user')->getId()) {
                return $this->json([
                    "accepted" => false,
                    "result" => "Nie masz uprawnień do usunięcia tego komentarza"
                ]);
            }
        }
        $retrievedComment = $comment->findBy(['id' => $id]);
        if (count($retrievedComment) == 0) {
            return $this->json([
                "accepted" => false,
                "result" => "Komentarz o takim id nie istnieje"
            ]);
        }
        $comment->deleteComment($id);
        return $this->json([
            "accepted" => true,
            "result" => "Udało się usunąć komentarz"
        ]);
    }
}