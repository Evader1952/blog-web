const method = {
    merchant:{
        list: '/api/web/authorize/merchant/list',
        detail: '/api/web/authorize/merchant/detail',
        updateMerchant: '/api/web/authorize/merchant/updateMerchant',
        commitInfoToMyBank: '/api/web/authorize/merchant/commitInfoToMyBank',
        batchExport: '/api/web/excel/import/batchExportMerchant',
        batchImport: '/api/web/excel/import/batchImportMerchant',
        getAreaListByLevelOrParentCode: '/api/web/area/getAreaListByLevelOrParentCode',
        reviewMerchant:"/api/web/authorize/merchant/reviewMerchant",
        merchantList:'/api/web/authorize/merchant/merchantList',
        getChangeLog: '/api/web/authorize/merchant/getChangeLog',
        importFile: '/api/web/excel/import/syncAutoCollectionStatus',
        getMerchantManage: '/api/pay/manage/detail',
        changePayState: '/api/pay/manage/changeState',
        changePayWay: '/api/pay/manage/changePayWay',
        open: '/api/pay/manage/open'
    },
    trade:{
        list:'/api/web/trade/list',
        add:'/api/web/trade/add',
        settle:'/api/web/trade/settle',
        getAmount:'/api/web/trade/getAmount',
        getAmountByTime:'/api/web/trade/getAmountByTime'
    },
    recharge:{
        list:'/api/web/recharge/list',
        doRecharge:'/api/web/recharge/doRecharge',
        getSetMealPlans:'/api/web/recharge/getSetMealPlans',
        setSetMealPlan:'/api/web/recharge/setSetMealPlan'
    },
    packet:{
        list:'/api/web/red/packet/list',
        batchExport:'/api/web/red/packet/batchExport',

        configlist:'/api/web/authorize/redpackconfiguration/list',
        configAdd:'/api/web/authorize/redpackconfiguration/insertConfiguration',
        findConfigById:'/api/web/authorize/redpackconfiguration/getConfiguration',
        updateConfig:'/api/web/authorize/redpackconfiguration/updateConfiguration',
        deleteConfig:'/api/web/authorize/redpackconfiguration/deleteConfiguration',
        changeState:'/api/web/authorize/redpackconfiguration/changeState',
        getAreaList:'/api/web/area/areaList',
        registerList:'/api/web/red/packet/registerList',
        closeAccount: '/api/web/red/packet/closeAccount',
        detail: '/api/web/red/packet/registerDetail',
        updateRegister: "/api/web/red/packet/updateRegister",
        getChangeLog: "/api/web/red/packet/getModifyLog"
    },
    refund:{
        list:'/api/web/pay/refund/order/list',
        changeRedPacketState:'/api/web/pay/refund/order/changeRedPacketState',
        changeRepaymentState:'/api/web/pay/refund/order/changeRepaymentState',
        settle:'/api/web/pay/refund/order/settle',
        batchExport:'/api/web/pay/refund/order/batchExport',
    },
    user:{
        login:'/api/web/user/login',
        permissionList:'/api/web/permission/list',
        changePassword:'/api/web/user/changePassword',
        list:'/api/web/user/list',
        freeze:'/api/web/user/updateUser',
    },
    blacklist:{
        list:'/api/web/authorize/redpackblacklist/list',
        deleteBlack:'/api/web/authorize/redpackblacklist/deleteBlacklist',
        add:'/api/web/authorize/redpackblacklist/insertBlacklist',
    },
    meal:{
        list:'/api/web/setMeal/list',
        detail:'/api/web/setMeal/detail',
        update:'/api/web/setMeal/update',
        updateDetail:'/api/web/setMeal/updateDetail',
        batchExport:'/api/web/setMeal/batchExport',
        batchImport:'/api/web/setMeal/batchImport',
        synchronizeMeal: '/api/web/setMeal/synchronizeMeal'
    },
    refundApply:{
        list:'/api/web/pay/refund/apply/list',
        refundApply: '/api/web/pay/refund/apply/refundApply',
        refundByPerson: '/api/web/pay/refund/apply/refundByPerson',
        refundByAuto: '/api/web/pay/refund/apply/refundByAuto',
        update: '/api/web/pay/refund/apply/update',
        urgent: '/api/web/pay/refund/apply/urgent',
        batchExport: '/api/web/pay/refund/apply/batchExport',
        selectRefundCount: '/api/web/pay/refund/apply/selectRefundCount',
        detail:'/api/web/pay/refund/apply/detail',
        fileDownLoad:'/api/web/pay/refund/apply/fileDownLoad',
        rateList:'/api/web/pay/advance/settle/list',
        rateUpdate:'api/web/pay/advance/settle/update',
        add:"/api/web/pay/refund/apply/addSecondAlipayTransferOrderNo"
    },
    role:{
        list:'/api/web/role/list',
        freezeRole:'/api/web/role/freezeRole',
        roleSelectList:'/api/web/role/roleSelectList',
        treeList:'/api/web/role/treeList',
        addRole:'/api/web/role/addRole',
        roleDetail:'/api/web/role/detail',
        updateRole:'/api/web/role/updateDetail',
        addUser:'/api/web/userRole/addUser',
        detail:'/api/web/userRole/detail',
        updateDetail:'/api/web/userRole/updateDetail',
        queryPwd:'/api/web/userRole/queryPwd',
    },
    supplyChainFail:{
        list:'/api/web/makeMoney/list',
        addWhite:'/api/web/makeMoney/addWhite',
        selectAccount:'/api/web/makeMoney/selectAccount',
        updateAccount:'/api/web/makeMoney/updateAccount',
        settle:'/api/web/makeMoney/settle',
    },
    upload:{
        getUploadToken:'upload/getToken',
    },
    offlineSettle:{
        list:'/api/web/pay/offline/settle/list',
        batchImport:'/api/web/pay/offline/settle/batchImport',
        exportTemplate:'/api/web/pay/offline/settle/exportTemplate'
    },
    file:{
        fileList:'/api/web/pay/refund/apply/getFileList',
        downLoad:'/api/open/myDownloadExcel',
        getHref:"/api/open//href",
        h5List: "/api/web/H5Index/list",
        changeSort : "/api/web/H5Index/changeSort"
    },
    merchantAccount:{
        list:'/api/web/merchant/account/list',
        getAreas:'/api/web/merchant/account/getAreas',
        queryPwd:'/api/web/merchant/account/queryPwd',
        update:'/api/web/merchant/account/update',
        addUser:'/api/web/merchant/account/addUser',
        batchImport:'/api/web/merchant/account/batchImport',
        subsidiaryMerchantList:'/api/web/merchant/account/subsidiaryMerchantList',
        addSubsidiaryMerchant:'/api/web/merchant/account/addSubsidiaryMerchant',
        updateSubsidiaryMerchant:'/api/web/merchant/account/updateSubsidiaryMerchant',
        updateDetail:'/api/web/merchant/account/updateDetail',
        resetPwd:'/api/web/merchant/account/resetPwd',
        addByWayId:'/api/web/merchant/account/addByWayId',
        userDimensionList:'/api/web/merchant/account/userDimensionList',
        updateRange:'/api/web/merchant/account/updateRange',
    },
    payWay:{
        list:'/api/web/payWay/manager/order/list',
        templateList:'/api/web/payWay/manager/order/templateList',
        getPayWayConfig:'/api/web/payWay/manager/order/getPayWayConfig',
        updatePayWay:'/api/web/payWay/manager/order/updatePayWay',
    }

}
export default method;