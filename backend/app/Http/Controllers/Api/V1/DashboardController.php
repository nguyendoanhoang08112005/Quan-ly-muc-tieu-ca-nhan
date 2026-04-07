<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\DashboardSummaryResource;
use App\Services\DashboardService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $dashboardService
    ) {
    }

    public function summary(Request $request): DashboardSummaryResource
    {
        return new DashboardSummaryResource(
            $this->dashboardService->summaryForUser($request->user())
        );
    }
}
