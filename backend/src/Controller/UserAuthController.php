<?php

namespace App\Controller;

use App\Entity\UserAuth;
use App\Repository\UserAuthRepository;
use App\Service\FileService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class UserAuthController extends AbstractController
{
    public function isRole($role, Request $request, UserAuthRepository $user): JsonResponse
    {
        if ($request->headers->has('authtoken')) {
            $token = $request->headers->get('authtoken');
            $retrievedUser = $user->findBy(['authtoken' => $token]);
            $roles = explode('-', $role);
            if (count($retrievedUser) == 0) {
                throw new UnauthorizedHttpException('brak tokenu');
            }
            if (in_array($retrievedUser[0]->getRole(), $roles)) {
                return $this->json(['accepted' => true, "result" => [
                    "id" => $retrievedUser[0]->getId(),
                    "imageurl" => $retrievedUser[0]->getImageurl(),
                    "email" => $retrievedUser[0]->getEmail(),
                    "role" => $retrievedUser[0]->getRole(),
                ]]);
            } else {
                throw new AccessDeniedHttpException();
            }
        } else {
            throw new UnauthorizedHttpException('brak tokenu');
        }
    }

    public function update(Request $request, UserAuthRepository $user, FileService $file): JsonResponse
    {
        $image = $request->files->get('user_image');
        if ($image == null) {
            return $this->json([
                "accepted" => false,
                "result" => "brak pliku"
            ]);
        }
        if (!$file->checkIfFileIsImage($image)) {
            return $this->json([
                "accepted" => false,
                "result" => "niepoprawny format pliku"
            ]);
        }
        $newFileName = $file->generateNameForFile($image);
        $file->upload($image, $newFileName, "avatars");
        $user->updateUserImage($request->attributes->get("_user")->getId(), $newFileName);
        return $this->json([
            "accepted" => true,
            "result" => true
        ]);
    }

    public function getAll(UserAuthRepository $user)
    {
        return $this->json([
            "accepted" => true,
            "result" => $user->getAll()
        ]);
    }

    public function delete(UserAuthRepository $user, $id)
    {
        $reUser = $user->find($id)->setActive(false);
        $user->save($reUser, true);
        return $this->json([
            "accepted" => true,
            "result" => true
        ]);
    }

    public function updateRole(UserAuthRepository $user, $id, $role)
    {
        $reUser = $user->find($id)->setRole($role);
        $user->save($reUser, true);
        return $this->json([
            "accepted" => true,
            "result" => true
        ]);
    }

    public function email(UserAuthRepository $user, Request $request)
    {
        $email = trim($request->request->get('email'));
        if ($email == null) {
            return $this->json([
                "accepted" => false,
                "result" => "brak emaila"
            ]);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->json([
                "accepted" => false,
                "result" => "niepoprawny email"
            ]);
        }
        $reUser = $user->findBy(['email' => $email]);
        $token = bin2hex(random_bytes(32));
        if (count($reUser) == 0) {
            $newUser = new UserAuth();
            $newUser->setActive(true);
            $newUser->setEmail($email);
            $newUser->setImageurl("/image/avatars/avatar.png");
            $newUser->setRole("user");
            $newUser->setLogincode($token);
            $user->save($newUser, true);
        } else {
            $reUser[0]->setLogincode($token);
            $user->save($reUser[0], true);
        }
        return $this->json([
            "accepted" => true,
            "result" => $token
        ]);
    }

    public function code(UserAuthRepository $user, Request $request)
    {
        $code = trim($request->request->get('code'));
        if ($code == null) {
            return $this->json([
                "accepted" => false,
                "result" => "brak kodu"
            ]);
        }
        $reUser = $user->findBy(['logincode' => $code]);
        if (count($reUser) == 0) {
            return $this->json([
                "accepted" => false,
                "result" => "niepoprawny kod"
            ]);
        }
        $token = bin2hex(random_bytes(32));
        $reUser[0]->setAuthtoken($token);
        $reUser[0]->setLogincode(null);
        $user->save($reUser[0], true);
        $response = new JsonResponse();
        $response->headers->set('authtoken', $token);
        $response->setData([
            "accepted" => true,
            "result" => $token
        ]);
        return $response;
    }
}