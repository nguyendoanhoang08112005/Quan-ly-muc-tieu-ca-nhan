<?php

namespace Database\Seeders;

use App\Models\Follow;
use App\Models\Goal;
use App\Models\User;
use Illuminate\Database\Seeder;

class FollowSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $publicGoals = Goal::where('is_public', true)->get();

        foreach ($publicGoals as $goal) {
            // Mỗi public goal được theo dõi bởi 2-5 users
            $followers = $users->random(rand(1, 2));
            
            foreach ($followers as $follower) {
                // Đảm bảo user không follow goal của chính mình
                if ($follower->id !== $goal->user_id) {
                    Follow::factory()
                        ->forGoal($goal)
                        ->withFollower($follower)
                        ->create();
                }
            }
        }
    }
}