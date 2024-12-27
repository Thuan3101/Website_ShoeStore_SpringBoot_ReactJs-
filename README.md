# Bài tập nhóm cuối kỳ

## Công nghệ sử dụng:
- **Backend**: Spring Boot  
- **Frontend**: ReactJS  
- **Cơ sở dữ liệu**: MariaDB  

## Thành viên tham gia:
1. Dương Văn Quy  
2. Nguyễn Thành Hiệp  
3. Ngô Minh Thuận  
4. Trần Văn Tú  
5. Lê Ngọc Hoàng  

## Hướng dẫn chạy website:

### 1. Tải source về:
```bash
git clone https://github.com/Thuan3101/Website_ShoeStore_SpringBoot_ReactJs-.git
```

### 2. Chạy source Backend:
1. Mở source Backend **ShoeStore** bằng **Eclipse**, **IntelliJ IDEA**, hoặc **Visual Studio Code**.  
2. Nếu không có lỗi, bạn có thể bỏ qua việc cập nhật Maven.  
3. Vào thư mục `src/main/resources` và chỉnh sửa tệp `application.properties`:  
   - Thay đổi `password` của MariaDB theo mật khẩu của bạn.  
4. Trong MariaDB, tạo một cơ sở dữ liệu với tên `shoestore_db`.  
5. Chạy ứng dụng Spring Boot.  
6. Mở website tại địa chỉ:  
   ```
   http://localhost:8088/swagger-ui/index.html
   ```

### 3. Chạy source Frontend:
1. Mở thư mục `shoestoreapp` bằng **Visual Studio Code**.  
2. Mở terminal và chạy các lệnh sau:  
   ```bash
   cd shoestoreapp
   npm install
   npm run start
   ```
3. Website sẽ chạy tại địa chỉ:  
   ```
   http://localhost:3000/
   ```

### 4. Đăng ký tài khoản:
1. Tạo tài khoản và nhận mã OTP qua email.  
2. Sau khi đăng ký thành công, truy cập MariaDB, tìm bảng `Users`, và chỉnh sửa cột `roles_id`:  
   - **1**: Quyền Admin.  
   - **2**: Quyền SuperAdmin.  

3. Đăng nhập lại website với quyền Admin hoặc SuperAdmin.

### 5. Dashboard:
1. Trong mục "Thêm sản phẩm", chọn **Upload Products from JSON File**.  
2. Tải tệp `data_giay_new.json` để cập nhật thông tin và hình ảnh sản phẩm.  

---

## Trải nghiệm Website:
Đề tài **"Website giới thiệu và bán giày dép trực tuyến"** là một ứng dụng web thương mại điện tử với các tính năng như:  
- Quản lý tài khoản.  
- Thêm và quản lý sản phẩm.  
- Hiển thị giao diện thân thiện và dễ sử dụng.  

Hãy truy cập và trải nghiệm ngay!

Giao diện Website
---
![image](https://github.com/user-attachments/assets/6e1572ce-be9f-4fe7-b350-87de38732488)
---
![image](https://github.com/user-attachments/assets/0e3a4488-d45e-4ac4-bc74-99d5fb8e3fc1)
![image](https://github.com/user-attachments/assets/02c4586f-0c62-4a81-9aeb-9e21ce0c6fc5)
![image](https://github.com/user-attachments/assets/5ad1cce2-22f5-4875-ba4d-d349373ecd8b)
![image](https://github.com/user-attachments/assets/000b045b-89f9-4dc4-b80c-1479a7e39b33)
![image](https://github.com/user-attachments/assets/28768ca3-2d75-4e9d-8c91-27b5c26967bf)
![image](https://github.com/user-attachments/assets/7ecc4352-bb04-44cd-97dc-602e1be168d6)
![image](https://github.com/user-attachments/assets/bdd46eab-4cad-4e55-892e-570884b1c1ca)
![image](https://github.com/user-attachments/assets/7e2c5a95-0d1a-49b1-ba97-87604b072375)
![image](https://github.com/user-attachments/assets/8ed7c91a-6828-411b-903f-6350d08e12b3)
![image](https://github.com/user-attachments/assets/971ecf53-1c54-4cf8-808a-d8627b6bc22d)
![image](https://github.com/user-attachments/assets/8d8b7511-6bf3-4dab-b24e-b99121c39260)
![image](https://github.com/user-attachments/assets/5b64108c-a8d5-4f4a-bf6a-c50db6cbfcf7)
![image](https://github.com/user-attachments/assets/9f2e05f3-b411-43d0-bbca-41902634cb1f)


