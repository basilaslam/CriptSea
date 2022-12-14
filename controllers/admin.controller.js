const adminService = require('../service/adminService');
const UserService = require('../service/UserService');

module.exports = class admin {
  static async renderAdminPage(req, res, next) {
    res.render('admin/index', {
      adminData: req.session.adminData,
      admin: req.session.admin,
    });
  }

  static async getAllNfts(req, res, next) {
    try {
      const nfts = await adminService.getAll();
      res.render('admin/NFTs', {
        nfts,
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async renderAdminLogin(req, res, next) {
    res.render('admin/login', { message: false, login: true });
  }

  static async login(req, res, next) {
    console.log('stage-1');
    const response = await adminService.login(req.body);
    console.log('stage-3', response);

    if (response) {
      req.session.admin = true;
      req.session.adminData = response.adminData;
      res.redirect('/admin');
    } else {
      const message = 'These credentials do not match our records';
      res.render('admin/login', { message, login: true });
    }
  }

  static async getUsers(req, res, next) {
    try {
      const users = await adminService.getUsers();
      res.render('admin/customers-list', { users });
    } catch (err) {
      console.log(err);
    }
  }

  static async getEditUser(req, res, next) {
    const { id } = req.params;
    const user = await adminService.getUser(id);
    res.render('admin/customer', { user });
  }

  static async banUser(req, res, next) {
    const { id } = req.params;
    const response = await adminService.banUser(id);

    res.redirect('/admin/users');
  }

  static async unBanUser(req, res, next) {
    const { id } = req.params;
    const response = await adminService.unBanUser(id);
    res.redirect('/admin/users');
  }

  static async getPendingRequests(req, res, next) {
    const pendingNFTs = await adminService.getPending();
    res.render('admin/NFT-requests', { nfts: pendingNFTs });
  }

  static async approveNft(req, res, next) {
    try {
      const { id } = req.params;
      const registerEntry = await UserService.registerCreated(id);

      const response = await adminService.approveNft(id);
      res.redirect('/admin/nft-requests');
    } catch (error) {
      console.log(error);
    }
  }

  static async cancelApprovalRequest(req, res, next) {
    const { id } = req.params;

    const response = await adminService.cancelApprovalRequest(id);
    res.redirect('/admin/nft-requests');
  }
};
