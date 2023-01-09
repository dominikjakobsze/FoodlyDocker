<?php

namespace App\Repository;

use App\Entity\Comment;
use App\Entity\Restaurant;
use App\Entity\UserAuth;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Comment>
 *
 * @method Comment|null find($id, $lockMode = null, $lockVersion = null)
 * @method Comment|null findOneBy(array $criteria, array $orderBy = null)
 * @method Comment[]    findAll()
 * @method Comment[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CommentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Comment::class);
    }

    public function save(Comment $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Comment $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * @return array
     */
    public function getAllComments(): array
    {
        return $this->createQueryBuilder('c')
            ->select('c.id, c.content, identity(c.restauranttable) restaurant_id, identity(c.userauthtable) user_id')
            ->andWhere('c.active = 1')
            ->getQuery()
            ->getResult();
    }

    /**
     * @param $id
     * @return array
     */
    public function getAllCommentsByRestaurant($id): array
    {
        return $this->createQueryBuilder('c')
            ->select('u.email, u.imageurl, c.content, identity(c.userauthtable) userId')
            ->innerJoin(UserAuth::class, 'u', 'WITH', 'u.id = c.userauthtable')
            ->andWhere('c.active = 1')
            ->andWhere('u.active = 1')
            ->andWhere('c.restauranttable = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getResult();
    }

    /**
     * @param $id
     * @return array
     */
    public function getAllCommentsByUser($id): array
    {
        return $this->createQueryBuilder('c')
            ->select('c.id comment_id, r.id restaurant_id, r.name restaurant_name, c.content comment_content, r.imageurl restaurant_image')
            ->innerJoin(Restaurant::class, 'r', 'WITH', 'r.id = c.restauranttable')
            ->andWhere('c.active = 1')
            ->andWhere('r.active = 1')
            ->andWhere('c.userauthtable = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getResult();
    }

    /**
     * @param $restaurantEntity
     * @param $content
     * @param $userauthEntity
     * @return void
     */
    public function addComment($restaurantEntity, $content, $userauthEntity)
    {
        $comment = new Comment();
        $comment->setActive(true);
        $comment->setRestauranttable($restaurantEntity);
        $comment->setContent($content);
        $comment->setUserauthtable($userauthEntity);
        $this->save($comment, true);
    }

    /**
     * @param $id
     * @param $content
     * @return void
     */
    public function updateComment($id, $content)
    {
        $comment = $this->find($id);
        $comment->setContent($content);
        $this->save($comment, true);
    }

    /**
     * @param $id
     * @return void
     */
    public function deleteComment($id)
    {
        $comment = $this->find($id);
        $comment->setActive(false);
        $this->save($comment, true);
    }

//    /**
//     * @return Comment[] Returns an array of Comment objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('c.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Comment
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
