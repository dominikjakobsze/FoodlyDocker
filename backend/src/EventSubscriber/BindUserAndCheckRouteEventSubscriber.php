<?php

namespace App\EventSubscriber;

use Exception;
use App\Entity\UserAuth;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\HttpKernel\KernelEvents;

class BindUserAndCheckRouteEventSubscriber implements EventSubscriberInterface
{
    public function __construct(private ManagerRegistry $doctrine)
    {
    }

    public function onKernelRequest(RequestEvent $event)
    {
        if ($event->isMainRequest()) {
            $routePath = $event->getRequest()->attributes->get('_route');
            $routePath = explode('-', explode('*', $routePath)[0]);
            if (count($routePath) == 0) {
                return;
            } else {
                if (!in_array($routePath[0], ['owner', 'admin', 'user'])) {
                    return;
                }
                $token = $event->getRequest()->headers->has('authtoken');
                if (!$token) {
                    throw new UnauthorizedHttpException("Brak Tokenu");
                } else {
                    $token = $event->getRequest()->headers->get('authtoken');
                    $retrievedUser = $this->doctrine->getRepository(UserAuth::class)->findBy(['authtoken' => $token]);
                    if (count($retrievedUser) == 0) {
                        throw new UnauthorizedHttpException('Nieprawidłowy Token');
                    } else {
                        $userRole = $retrievedUser[0]->getRole();
                        if (in_array($userRole, $routePath)) {
                            $event->getRequest()->attributes->set('_user', $retrievedUser[0]);
                        } else {
                            throw new AccessDeniedHttpException('Brak uprawnień');
                        }
                    }
                }
            }
        }
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => 'onKernelRequest',
        ];
    }
}
