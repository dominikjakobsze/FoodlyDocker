<?php

namespace App\Repository;

use App\Entity\UserAuth;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UserAuth>
 *
 * @method UserAuth|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserAuth|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserAuth[]    findAll()
 * @method UserAuth[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserAuthRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserAuth::class);
    }

    public function save(UserAuth $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(UserAuth $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function updateUserImage($id, $imageurl)
    {
        $user = $this->find($id)->setImageurl("/image/avatars/" . $imageurl);
        $this->save($user, true);
    }

    public function getAll()
    {
        return $this->createQueryBuilder('u')
            ->select('u.id, u.email, u.role, u.imageurl, u.active')
            ->andWhere('u.active = 1')
            ->getQuery()
            ->getResult();
    }

    public function showAll()
    {
        return $this->createQueryBuilder('u')
            ->select('u.id, u.imageurl image')
            ->andWhere('u.active = 1')
            ->getQuery()
            ->getResult();
    }

//    /**
//     * @return UserAuth[] Returns an array of UserAuth objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('u.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?UserAuth
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
